from sqlalchemy import Column, Integer, String, Float, DateTime, Text
from .connection import Base


class Event(Base):
    __tablename__ = "events"

    id = Column(Integer, primary_key=True, index=True)
    timestamp = Column(DateTime, nullable=False)
    event_type = Column(String, nullable=False)
    source = Column(String, nullable=False)
    username = Column(String, nullable=True)
    source_ip = Column(String, nullable=True)
    destination_ip = Column(String, nullable=True)
    hostname = Column(String, nullable=True)
    severity = Column(String, nullable=True)
    raw_data = Column(Text, nullable=True)
    anomaly_score = Column(Float, nullable=True)


class Incident(Base):
    __tablename__ = "incidents"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    severity = Column(String, nullable=False)
    risk_score = Column(Float, nullable=True)
    status = Column(String, default="open")
    summary = Column(Text, nullable=True)