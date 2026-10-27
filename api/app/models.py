from sqlalchemy import Column, Integer, String, Text, DateTime, SmallInteger, ForeignKey
from sqlalchemy.orm import relationship
from .database import Base

class Category(Base):
    __tablename__ = "category"
    catid = Column(SmallInteger, primary_key=True, index=True)
    name = Column(String(45), nullable=False)

class Status(Base):
    __tablename__ = "status"
    staid = Column(SmallInteger, primary_key=True, index=True)
    description = Column(String(20), nullable=False)

class Mission(Base):
    __tablename__ = "mission"

    misid = Column(Integer, primary_key=True, index=True)
    title = Column(String(45), nullable=False)
    details = Column(Text, nullable=True)
    deadline = Column(DateTime, nullable=False)
    couidfk = Column(Integer, nullable=False)
    
    catidfk = Column(SmallInteger, ForeignKey("category.catid"), nullable=False)
    staidfk = Column(SmallInteger, ForeignKey("status.staid"), nullable=False)

    category = relationship("Category")
    status = relationship("Status")