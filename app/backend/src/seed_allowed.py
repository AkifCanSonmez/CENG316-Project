from sqlalchemy.orm import Session
from database import SessionLocal, engine, Base
from models import User, Course, TranscriptEntry
import random

def seed_all():
    Base.metadata.drop_all(bind=engine)  # opsiyonel: veritabanını sıfırlamak için
    Base.metadata.create_all(bind=engine)
    db: Session = SessionLocal()

    # 1) Kullanıcılar (5 öğrenci + 1 akademisyen + 1 admin)
    user_data = [
        {"email": "akifsonmez@std.iyte.edu.tr",  "password": "353535",    "role": "student"},
        {"email": "masudguluyev@std.iyte.edu.tr","password": "353535",    "role": "student"},
        {"email": "elifkeskin@std.iyte.edu.tr",  "password": "353535",    "role": "student"},
        {"email": "mehmetkaya@std.iyte.edu.tr",  "password": "353535",    "role": "student"},
        {"email": "zeynepbal@std.iyte.edu.tr",   "password": "353535",    "role": "student"},
        {"email": "vagifaliyev@std.iyte.edu.tr", "password": "academic123","role": "academic"},
        {"email": "ogrencii@iyte.edu.tr",        "password": "admin123",   "role": "admin"},
        {"email": "dekan@iyte.edu.tr", "password": "dean123", "role": "dean"},
    ]
    for u in user_data:
        if not db.query(User).filter_by(email=u["email"]).first():
            db.add(User(**u))
            print(f"[user] Eklendi: {u['email']}")
    db.commit()

    # 2) Dersler
    course_defs = [
        ("CENG316", "Yazılım Mühendisliği", 4, True, None),
        ("MATH201", "Lineer Cebir", 3, True, None),
        ("ELEC301", "Dijital Elektronik", 4, True, None),
        ("HIST101", "Türk ve Dünya Tarihi", 2, False, "non-technical"),
        ("AI202", "Yapay Zeka Uygulamaları", 3, False, "technical"),
    ]
    for code, name, cr, req, etype in course_defs:
        if not db.query(Course).filter_by(code=code).first():
            db.add(Course(code=code, name=name, credits=cr, required=req, elective_type=etype))
            print(f"[ders] Eklendi: {code}")
    db.commit()

    # 3) Tüm öğrenciler için transkript oluştur
    students = db.query(User).filter_by(role="student").all()
    courses  = db.query(Course).all()

    for student in students:
        for course in courses:
            exists = db.query(TranscriptEntry).filter_by(student_id=student.id, course_id=course.id).first()
            if exists:
                continue
            grade = round(random.uniform(3.0, 4.0), 2) if course.required else round(random.uniform(1.0, 4.0), 2)
            db.add(TranscriptEntry(student_id=student.id, course_id=course.id, grade=grade))
            print(f"[transkript] {student.email} → {course.code} = {grade}")
    db.commit()
    db.close()
    print("✅ seed işlemi tamamlandı.")

if __name__ == "__main__":
    seed_all()
