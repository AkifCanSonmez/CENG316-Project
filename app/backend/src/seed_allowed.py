# app/backend/src/seed_allowed.py

from sqlalchemy.orm import Session
from database import SessionLocal, engine, Base
from models import AllowedUser, User

# 1) Ensure tables exist
Base.metadata.create_all(bind=engine)

# 2) Emails allowed to register (but _not_ yet actual accounts)
allowed_data = [
    {"email": "muratdura@std.iyte.edu.tr",  "role": "student"},
    {"email": "berkanbayrak@std.iyte.edu.tr","role": "student"},
    {"email": "vagifaliyev@std.iyte.edu.tr", "role": "academic"},
]

# 3) Already-registered users, with credentials + role
user_data = [
    {"email": "akifsonmez@std.iyte.edu.tr",  "password": "353535",       "role": "student"},
    {"email": "masudguluyev@std.iyte.edu.tr","password": "353535",       "role": "student"},
    {"email": "vagifaliyev@std.iyte.edu.tr", "password": "academic123", "role": "academic"},
]

db: Session = SessionLocal()

# Seed AllowedUser table
for row in allowed_data:
    if not db.query(AllowedUser).filter_by(email=row["email"]).first():
        db.add(AllowedUser(email=row["email"], role=row["role"]))

# Seed User table
for row in user_data:
    if not db.query(User).filter_by(email=row["email"]).first():
        # Optional: ensure role matches AllowedUser, if present
        allowed = db.query(AllowedUser).filter_by(email=row["email"]).first()
        if allowed and allowed.role != row["role"]:
            raise RuntimeError(
                f"Seed mismatch: {row['email']} allowed as {allowed.role} but user_data says {row['role']}"
            )
        db.add(User(
            email=row["email"],
            password=row["password"],
            role=row["role"]
        ))

db.commit()
db.close()

print("Seeding complete: allowed_users and users tables populated.")
