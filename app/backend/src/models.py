from sqlalchemy import Column, Integer, String, UniqueConstraint
from database import Base

class AllowedUser(Base):
    __tablename__ = "allowed_users"
    id    = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    role  = Column(String(50), nullable=False)
    __table_args__ = (UniqueConstraint("email"),)

class User(Base):
    __tablename__ = "users"
    id       = Column(Integer, primary_key=True, index=True)
    email    = Column(String(255), unique=True, index=True, nullable=False)
    password = Column(String(255), nullable=False)
    role     = Column(String(50), nullable=False)
    __table_args__ = (UniqueConstraint("email"),)
