from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.models.task import Task
from app.models.project import Project
from app.models.habit import Habit
from app.models.note import Note
from app.models.event import Event
from app.models.user import User
from app.schemas.note import NoteCreate, NoteRead
from app.schemas.task import TaskCreate, TaskRead, TaskUpdate
from app.schemas.project import ProjectCreate, ProjectRead, ProjectUpdate
from app.schemas.habit import HabitCreate, HabitRead, HabitUpdate
from app.schemas.event import EventCreate, EventRead
from app.db.session import get_session
from app.utils.jwt import get_current_user

router = APIRouter()

@router.get("/")
async def global_search(q: str, db: AsyncSession = Depends(get_session), user_id: int = Depends(get_current_user)):
    result = {}

    # Tasks
    tasks_result = await db.execute(
        select(Task).where(Task.user_id == user_id, Task.title.ilike(f"%{q}%"))
    )
    result["tasks"] = [
        {"id": task.id, "title": task.title, "type": "task"}
        for task in tasks_result.scalars().all()
    ]

    # Projects
    projects_result = await db.execute(
        select(Project).where(Project.user_id == user_id, Project.name.ilike(f"%{q}%"))
    )
    result["projects"] = [
        {"id": p.id, "title": p.name, "type": "project"}
        for p in projects_result.scalars().all()
    ]

    # Habits
    habits_result = await db.execute(
        select(Habit).where(Habit.user_id == user_id, Habit.title.ilike(f"%{q}%"))
    )
    result["habits"] = [
        {"id": h.id, "title": h.title, "type": "habit"}
        for h in habits_result.scalars().all()
    ]

    # Notes
    notes_result = await db.execute(
        select(Note).where(Note.user_id == user_id, Note.title.ilike(f"%{q}%"))
    )
    result["notes"] = [
        {"id": n.id, "title": n.title, "type": "note"}
        for n in notes_result.scalars().all()
    ]

    # Events
    events_result = await db.execute(
        select(Event).where(Event.user_id == user_id, Event.title.ilike(f"%{q}%"))
    )
    result["events"] = [
        {"id": e.id, "title": e.title, "type": "event"}
        for e in events_result.scalars().all()
    ]

    return result
