from fastapi import FastAPI, HTTPException, Depends, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime
from models import RegisterableUser
from sqlalchemy.orm import joinedload

from database import SessionLocal, engine, Base
from models import User, Course, TranscriptEntry, GraduationApplication, CertificateAssignment
from seed_allowed import Seeder

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# -------------------- ŞEMALAR --------------------

class RegisterRequest(BaseModel):
    email: str
    password: str
    role: str

class AuthRequest(BaseModel):
    email: str
    password: str

class AuthResponse(BaseModel):
    id: int
    email: str
    role: str

class ApplicationCreate(BaseModel):
    student_id: int
    initiated_by: str

class StudentInfo(BaseModel):
    student_id: str

    class Config:
        orm_mode = True

class ApplicationRead(BaseModel):
    id: int
    student_id: int
    initiated_by: str
    status: str
    is_closed: bool
    created_at: datetime
    student: StudentInfo  # 👈 ilişkili öğrenci nesnesi

    class Config:
        orm_mode = True

class Decision(BaseModel):
    decision: str

class CertificateAssignRequest(BaseModel):
    honor: float
    high_honor: float

class ResetResponse(BaseModel):
    msg: str

# -------------------- SEED --------------------
@app.on_event("startup")
def seed():
    Base.metadata.drop_all(bind=engine)  # opsiyonel: veritabanını sıfırlamak için
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    Seeder(db).run_all()
    db.close()

@app.get("/reset-db", response_model=ResetResponse)
def reset_database():
    Base.metadata.drop_all(bind=engine)  # opsiyonel: veritabanını sıfırlamak için
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    Seeder(db).run_all()
    db.close()
    return {"msg": "Veritabanı sıfırlandı ve seed işlemi tamamlandı."}

# -------------------- AUTH --------------------

@app.post("/register", response_model=AuthResponse)
def register(data: RegisterRequest, db: Session = Depends(get_db)):
    # 1. Erişim kontrolü
    allowed = db.query(RegisterableUser).filter_by(
        email=data.email, role=data.role, registerable=True
    ).first()
    if not allowed:
        raise HTTPException(status_code=403, detail="Bu e-posta ile kayıt olunamaz.")
    
    # 2. Mevcut kullanıcı kontrolü
    existing = db.query(User).filter_by(email=data.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Bu e-posta zaten kayıtlı.")
    
    # 3. Yeni kullanıcı oluştur
    u = User(
        email=data.email,
        password=data.password,
        role=data.role,
        student_id=allowed.student_id
    )
    db.add(u)
    db.commit()
    db.refresh(u)

    # 4. Eğer öğrenci ise otomatik transkript oluştur
    if u.role == "student":
        Seeder(db).seed_transcripts_for_student(u)

    return AuthResponse(id=u.id, email=u.email, role=u.role)


@app.post("/login", response_model=AuthResponse)
def login(data: AuthRequest, db: Session = Depends(get_db)):
    u = db.query(User).filter_by(email=data.email).first()
    if not u or u.password != data.password:
        raise HTTPException(401, "Giriş başarısız")
    return AuthResponse(id=u.id, email=u.email, role=u.role)

# -------------------- GRADUATION HELPERS --------------------

def calculate_graduation_list(db: Session):
    apps = db.query(GraduationApplication).filter_by(status="Onaylandı", is_closed=True).all()
    result = []
    for app in apps:
        grades = [e.grade for e in app.student.transcripts]
        if not grades:
            continue
        gpa = round(sum(grades) / len(grades), 2)
        result.append({"student": app.student.email, "gpa": gpa})
    return sorted(result, key=lambda x: x["gpa"], reverse=True)

# -------------------- APPLICATION --------------------

@app.post("/applications/", response_model=int)
def create_application(data: ApplicationCreate, db: Session = Depends(get_db)):
    exists = db.query(GraduationApplication).filter_by(student_id=data.student_id, is_closed=False).first()
    if exists:
        raise HTTPException(400, "Zaten açık bir başvuru var")
    app = GraduationApplication(**data.dict())
    db.add(app)
    db.commit()
    db.refresh(app)
    return app.id


@app.get("/applications/", response_model=List[ApplicationRead])
def list_all_applications(db: Session = Depends(get_db)):
    return db.query(GraduationApplication).options(joinedload(GraduationApplication.student)).all()


@app.post("/applications/initiate-bulk")
def bulk_applications(db: Session = Depends(get_db)):
    students = db.query(User).filter_by(role="student").all()
    created = []
    for s in students:
        exists = db.query(GraduationApplication).filter_by(student_id=s.id).first()
        if not exists:
            app = GraduationApplication(
                student_id=s.id,
                initiated_by="admin",
                created_at=datetime.utcnow(),  # oluşturulma zamanı
                status="Devam Ediyor"               # advisor onayı bekliyor
            )
            db.add(app)
            created.append(s.email)
    db.commit()
    return {"created": created}


@app.post("/applications/{app_id}/decision")
def decide_application(app_id: int, dec: Decision, db: Session = Depends(get_db)):
    app = db.query(GraduationApplication).get(app_id)
    if not app:
        raise HTTPException(404, "Başvuru yok")
    app.status = dec.decision
    app.is_closed = True
    db.commit()
    return {"msg": "Karar kaydedildi."}

@app.get("/students/{sid}/eligibility")
def check_eligibility(sid: int, db: Session = Depends(get_db)):
    student = db.query(User).filter_by(id=sid).first()
    if not student:
        raise HTTPException(404, "Öğrenci bulunamadı")

    entries = student.transcripts
    if not entries:
        raise HTTPException(400, "Öğrencinin transkripti bulunamadı")

    gpa = sum(e.grade for e in entries) / len(entries)
    required = [e for e in entries if e.course.required]
    passed_required = all(e.grade >= 2.0 for e in required)

    electives = [e for e in entries if not e.course.required]
    tech = sum(1 for e in electives if e.course.elective_type == "technical" and e.grade >= 2.0)
    nontech = sum(1 for e in electives if e.course.elective_type == "non-technical" and e.grade >= 2.0)

    return {
        "gpa": round(gpa, 2),
        "required_passed": passed_required,
        "technical": tech,
        "nontechnical": nontech
    }


@app.post("/applications/generate-list")
def generate_list_endpoint(db: Session = Depends(get_db)):
    return calculate_graduation_list(db)

@app.get("/applications/list/top3")
def top3_students(db: Session = Depends(get_db)):
    full = calculate_graduation_list(db)
    if not full:
        raise HTTPException(404, "Liste yok")
    return full[:3]

@app.post("/applications/list/assign-certificates")
def assign_certificates(req: CertificateAssignRequest, db: Session = Depends(get_db)):
    full = calculate_graduation_list(db)
    if not full:
        raise HTTPException(404, "Liste oluşturulmamış")
    assigned = []
    for r in full:
        cert = None
        if r["gpa"] >= req.high_honor:
            cert = "Yüksek Onur"
        elif r["gpa"] >= req.honor:
            cert = "Onur"
        else:
            continue
        app = db.query(GraduationApplication).join(User).filter(User.email == r["student"]).first()
        if app:
            db.add(CertificateAssignment(application_id=app.id, certificate=cert))
            assigned.append({"student": r["student"], "certificate": cert})
    db.commit()
    return assigned

@app.get("/graduation-list")
def view_graduation_list(request: Request, db: Session = Depends(get_db)):
    user: User = db.query(User).filter_by(email=request.headers.get("x-user-email")).first()
    if not user or user.role != "dean":
        raise HTTPException(status_code=403, detail="Sadece dekanlar görüntüleyebilir.")
    return calculate_graduation_list(db)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="localhost", port=8000)