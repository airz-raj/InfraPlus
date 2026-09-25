from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime, Enum, Text
from sqlalchemy.sql import func
from geoalchemy2 import Geometry
from core.database import Base
import enum

class InteractionStatus(str, enum.Enum):
    PENDING = "PENDING"
    REVIEW_REQUIRED = "REVIEW_REQUIRED"
    PROCESSED = "PROCESSED"
    REJECTED = "REJECTED"

class User(Base):
    __tablename__ = 'users'
    
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    email = Column(String, unique=True, index=True)
    role = Column(String, default="citizen") # citizen, policymaker
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class Interaction(Base):
    __tablename__ = 'interactions'
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey('users.id'))
    media_type = Column(String) # 'text', 'audio'
    media_ref = Column(String) # S3 link or local path to audio file if audio
    raw_intent = Column(Text) # Text transcription or raw text
    category = Column(String, index=True) # e.g. water, electricity, roads
    severity = Column(Integer) # 1-5
    status = Column(Enum(InteractionStatus), default=InteractionStatus.PENDING, index=True)
    
    # Geospatial indexing: SRID 4326 for standard lat/lng
    location = Column(Geometry(geometry_type='POINT', srid=4326), index=True)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class InfrastructureProject(Base):
    __tablename__ = 'infrastructure_projects'
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    description = Column(Text)
    category = Column(String, index=True)
    budget = Column(Float)
    
    # Polygon or Point depending on the project scope, using Point for simplicity in MVP
    location = Column(Geometry(geometry_type='POINT', srid=4326), index=True)
    
    start_date = Column(DateTime(timezone=True))
    end_date = Column(DateTime(timezone=True))
