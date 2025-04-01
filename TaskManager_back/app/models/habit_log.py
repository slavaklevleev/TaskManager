from sqlalchemy import Column, Integer, ForeignKey, Date, Boolean
from app.db.base_class import Base

class HabitLog(Base):
    __tablename__ = "habit_logs"

    id = Column(Integer, primary_key=True, index=True)
    habit_id = Column(Integer, ForeignKey("habits.id"))
    date = Column(Date, nullable=False)
    completed = Column(Boolean, default=False)