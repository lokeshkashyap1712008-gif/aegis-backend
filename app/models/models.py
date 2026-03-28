from sqlalchemy import Column, String, Integer, Float, DateTime
from sqlalchemy.ext.declarative import declarative_base
import datetime

Base = declarative_base()

class Event(Base):
    __tablename__ = "events"

    id = Column(Integer, primary_key=True)
    node_id = Column(String)
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)
    http_status = Column(Integer)
    response_time = Column(Float)

class Alert(Base):
    __tablename__ = "alerts"

    id = Column(Integer, primary_key=True)
    node_id = Column(String)
    type = Column(String)
    severity = Column(Integer)
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)