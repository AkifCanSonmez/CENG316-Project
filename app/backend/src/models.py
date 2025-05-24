from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, Float
from sqlalchemy.orm import relationship
from database import Base

class User(Base):
    __tablename__ = "users"
    id       = Column(Integer, primary_key=True, index=True)
    email    = Column(String(255), unique=True, index=True, nullable=False)
    password = Column(String(255), nullable=False)
    role     = Column(String(50), nullable=False)
    applications = relationship("GraduationApplication", back_populates="student")
    transcripts  = relationship("TranscriptEntry", back_populates="student")

class GraduationApplication(Base):
    __tablename__ = "graduation_applications"
    id           = Column(Integer, primary_key=True, index=True)
    student_id   = Column(Integer, ForeignKey("users.id"), nullable=False)
    initiated_by = Column(String(20), nullable=False)
    status       = Column(String(20), default="pending")
    is_closed    = Column(Boolean, default=False)
    created_at   = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at   = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    student = relationship("User", back_populates="applications")

class Course(Base):
    __tablename__ = "courses"
    id           = Column(Integer, primary_key=True, index=True)
    code         = Column(String(10), unique=True, nullable=False)
    name         = Column(String(255), nullable=False)
    credits      = Column(Integer, nullable=False)
    required     = Column(Boolean, nullable=False)
    elective_type= Column(String(20))  # 'technical' | 'non-technical' | None

class TranscriptEntry(Base):
    __tablename__ = "transcript_entries"
    id         = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    course_id  = Column(Integer, ForeignKey("courses.id"), nullable=False)
    grade      = Column(Float, nullable=False)

    student = relationship("User", back_populates="transcripts")
    course  = relationship("Course")

class CertificateAssignment(Base):
    __tablename__ = "certificate_assignments"
    id              = Column(Integer, primary_key=True, index=True)
    application_id  = Column(Integer, ForeignKey("graduation_applications.id"), nullable=False)
    certificate     = Column(String(50), nullable=False)  # e.g. "Yüksek Onur"
