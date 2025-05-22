# app/backend/src/main.py

import os
from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sqlalchemy.orm import Session
from sqlalchemy import text

from database import SessionLocal, engine, Base
from models import User, AllowedUser

# Pydantic schemas
class RegisterRequest(BaseModel):
    email: str
    password: str
    role: str

class AuthRequest(BaseModel):
    email: str
    password: str

class AuthResponse(BaseModel):
    email: str
    role: str

app = FastAPI()

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
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

@app.on_event("startup")
def reset_and_seed():
    """
    WARNING: Drops and recreates all tables, then seeds AllowedUser+User.
    Only for local dev!
    """
    # 1) Drop and recreate schema
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)

    db = SessionLocal()

    # 2) Seed allowed_users
    for email, role in [
        ("muratdura@std.iyte.edu.tr",  "student"),
        ("berkanbayrak@std.iyte.edu.tr","student"),
        ("vagifaliyev@std.iyte.edu.tr", "academic"),
    ]:
        db.add(AllowedUser(email=email, role=role))

    # 3) Seed users
    for email, pwd, role in [
        ("akifsonmez@std.iyte.edu.tr",  "353535",       "student"),
        ("masudguluyev@std.iyte.edu.tr","353535",       "student"),
        ("vagifaliyev@std.iyte.edu.tr", "academic123", "academic"),
    ]:
        db.add(User(email=email, password=pwd, role=role))

    db.commit()
    db.close()

@app.post("/register", response_model=AuthResponse)
def register(data: RegisterRequest, db: Session = Depends(get_db)):
    email = data.email.lower().strip()
    pwd   = data.password
    chosen_role = data.role

    # 1) Prevent duplicate registration first
    if db.query(User).filter_by(email=email).first():
        raise HTTPException(400, "Bu e‑posta zaten kayıtlı.")

    # 2) Now check allowed_users
    allowed = db.query(AllowedUser).filter_by(email=email).first()
    if not allowed:
        raise HTTPException(400, "Kayıt için geçerli bir üniversite e‑postası girin.")

    # 3) Role must match
    if chosen_role != allowed.role:
        raise HTTPException(
            400,
            f"Bu e‑posta için rol '{allowed.role}' olmalıdır."
        )

    # 4) Create new user
    user = User(email=email, password=pwd, role=allowed.role)
    db.add(user)
    db.commit()

    return AuthResponse(email=email, role=user.role)


@app.post("/login", response_model=AuthResponse)
def login(data: AuthRequest, db: Session = Depends(get_db)):
    email = data.email.lower().strip()
    pwd = data.password

    user = db.query(User).filter_by(email=email).first()
    if not user or user.password != pwd:
        raise HTTPException(401, "Geçersiz kimlik bilgileri.")
    return AuthResponse(email=user.email, role=user.role)
