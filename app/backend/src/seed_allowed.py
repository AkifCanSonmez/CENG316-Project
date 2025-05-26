from sqlalchemy.orm import Session
from models import User, Course, TranscriptEntry, RegisterableUser
import random


class Seeder:
    def __init__(self, db: Session):
        self.db = db

    def seed_users(self):
        user_data = [
            # 🎯 Tüm şartları sağlayan (sertifikasız mezun olacaklar)
            {"email": "ogrenci010@std.iyte.edu.tr", "password": "353535", "role": "student", "student_id": "280201010"},
            {"email": "ogrenci015@std.iyte.edu.tr", "password": "353535", "role": "student", "student_id": "280201015"},
            {"email": "mezunonursuz1@std.iyte.edu.tr", "password": "353535", "role": "student", "student_id": "280201022"},
            {"email": "mezunonursuz2@std.iyte.edu.tr", "password": "353535", "role": "student", "student_id": "280201023"},

            # 🏅 Yüksek Onur
            {"email": "yuksekonur@std.iyte.edu.tr", "password": "353535", "role": "student", "student_id": "280201020"},
            # 🥈 Onur
            {"email": "onurlu@std.iyte.edu.tr", "password": "353535", "role": "student", "student_id": "280201021"},

            # 📉 Düşük GPA / Diğer senaryolar
            {"email": "dusukgpa@std.iyte.edu.tr", "password": "353535", "role": "student", "student_id": "280201011"},
            {"email": "zorunlukalan@std.iyte.edu.tr", "password": "353535", "role": "student", "student_id": "280201012"},
            {"email": "teknikeksik@std.iyte.edu.tr", "password": "353535", "role": "student", "student_id": "280201013"},
            {"email": "sosyaleksik@std.iyte.edu.tr", "password": "353535", "role": "student", "student_id": "280201014"},

            # Diğer roller
            {"email": "vaqifaliyev@iyte.edu.tr", "password": "academic123", "role": "academic"},
            {"email": "ogrenci@iyte.edu.tr", "password": "admin123", "role": "admin"},
            {"email": "dekan@iyte.edu.tr", "password": "dean123", "role": "dean"},
        ]

        for u in user_data:
            if not self.db.query(User).filter_by(email=u["email"]).first():
                self.db.add(User(**u))
                print(f"[user] Eklendi: {u['email']}")
        self.db.commit()

    def seed_courses(self):
        course_defs = [
            ("CENG316", "Yazılım Mühendisliği", 4, True, None),
            ("MATH201", "Lineer Cebir", 3, True, None),
            ("ELEC301", "Dijital Elektronik", 4, True, None),
            ("HIST101", "Türk ve Dünya Tarihi", 2, False, "non-technical"),
            ("AI202", "Yapay Zeka Uygulamaları", 3, False, "technical"),
        ]
        for code, name, cr, req, etype in course_defs:
            if not self.db.query(Course).filter_by(code=code).first():
                self.db.add(Course(code=code, name=name, credits=cr, required=req, elective_type=etype))
                print(f"[ders] Eklendi: {code}")
        self.db.commit()

    def seed_transcripts_for_all_students(self):
        students = self.db.query(User).filter_by(role="student").all()
        for student in students:
            self.seed_transcripts_for_student(student)

    def seed_transcripts_for_student(self, student: User):
        from models import Course, TranscriptEntry
        courses = self.db.query(Course).all()
        required = [c for c in courses if c.required]
        tech = [c for c in courses if c.elective_type == "technical"]
        nontech = [c for c in courses if c.elective_type == "non-technical"]

        grades = []

        # 🎯 Tüm şartları sağlayan (ortalama üstü)
        if student.student_id in ["280201010", "280201015"]:
            grades = [(c, 3.5) for c in required + tech + nontech]
        # 📘 Mezun ama sertifika almayacak (2.3 ortalama)
        elif student.student_id in ["280201022", "280201023"]:
            grades = [(c, 2.3) for c in required + tech + nontech]
        # 🏅 Yüksek Onur alacak (GPA > 3.7)
        elif student.student_id == "280201020":
            grades = [(c, 3.9) for c in required + tech + nontech]
        # 🥈 Onur alacak (GPA > 3.0)
        elif student.student_id == "280201021":
            grades = [(c, 3.2) for c in required + tech + nontech]
        # 📉 GPA düşük
        elif student.student_id == "280201011":
            grades = [(c, 1.5) for c in required + tech + nontech]
        # ❌ Zorunlu dersten kalan
        elif student.student_id == "280201012":
            grades = [(required[0], 1.0)] + [(c, 3.0) for c in required[1:] + tech + nontech]
        # ❌ Teknik eksik
        elif student.student_id == "280201013":
            grades = [(c, 3.0) for c in required + nontech]
        # ❌ Sosyal eksik
        elif student.student_id == "280201014":
            grades = [(c, 3.0) for c in required + tech]
        # Diğerleri random
        else:
            grades = [(c, round(random.uniform(1.0, 4.0), 2)) for c in courses]

        for course, grade in grades:
            exists = self.db.query(TranscriptEntry).filter_by(student_id=student.id, course_id=course.id).first()
            if not exists:
                self.db.add(TranscriptEntry(student_id=student.id, course_id=course.id, grade=grade))
                print(f"[transkript] {student.email} → {course.code} = {grade}")
        self.db.commit()

    def seed_registerables(self):
        registerables = [
            {"email": "berkanbayrak@std.iyte.edu.tr", "role": "student", "registerable": True, "student_id": "280201080"},
            {"email": "hammetpolat@std.iyte.edu.tr", "role": "student", "registerable": True, "student_id": "280201081"},
        ]
        for r in registerables:
            if not self.db.query(RegisterableUser).filter_by(email=r["email"]).first():
                self.db.add(RegisterableUser(**r))
                print(f"[registerable] Eklendi: {r['email']}")
        self.db.commit()

    def run_all(self):
        self.seed_users()
        self.seed_courses()
        self.seed_transcripts_for_all_students()
        self.seed_registerables()
