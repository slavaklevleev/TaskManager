from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.schemas.habit import HabitCreate, HabitRead, HabitUpdate
from app.schemas.habit_log import HabitLogToggle, HabitLogRead
from app.models.habit import Habit
from app.models.habit_log import HabitLog
from app.db.session import get_session
from app.utils.jwt import get_current_user
from app.services.habits import calculate_streak
from datetime import date

router = APIRouter()

@router.post("/", response_model=HabitRead)
async def create_habit(habit: HabitCreate, db: AsyncSession = Depends(get_session), user_id: int = Depends(get_current_user)):
    db_habit = Habit(**habit.dict(), user_id=user_id)
    db.add(db_habit)
    await db.commit()
    await db.refresh(db_habit)
    return db_habit

@router.get("/", response_model=list[HabitRead])
async def read_habits(db: AsyncSession = Depends(get_session), user_id: int = Depends(get_current_user)):
    result = await db.execute(select(Habit).where(Habit.user_id == user_id))
    habits = result.scalars().all()
    for habit in habits:
        logs_result = await db.execute(
            select(HabitLog).where(HabitLog.habit_id == habit.id).order_by(HabitLog.date.desc())
        )
        logs = logs_result.scalars().all()
        habit.recent_logs = logs[:7]
        habit.streak = calculate_streak(habit, logs)
    return habits

@router.get("/{habit_id}", response_model=HabitRead)
async def get_habit(habit_id: int, db: AsyncSession = Depends(get_session), user_id: int = Depends(get_current_user)):
    habit = await db.get(Habit, habit_id)
    if habit is None or habit.user_id != user_id:
        raise HTTPException(status_code=404, detail="Habit not found")
    logs_result = await db.execute(
        select(HabitLog).where(HabitLog.habit_id == habit.id).order_by(HabitLog.date)
    )
    logs = logs_result.scalars().all()
    habit.recent_logs = logs[:7]
    habit.streak = calculate_streak(habit, logs)
    return habit

@router.put("/{habit_id}", response_model=HabitRead)
async def update_habit(habit_id: int, habit_data: HabitUpdate, db: AsyncSession = Depends(get_session), user_id: int = Depends(get_current_user)):
    habit = await db.get(Habit, habit_id)
    if habit is None or habit.user_id != user_id:
        raise HTTPException(status_code=404, detail="Habit not found")
    for key, value in habit_data.dict(exclude_unset=True).items():
        setattr(habit, key, value)
    await db.commit()
    await db.refresh(habit)
    return habit

@router.delete("/{habit_id}")
async def delete_habit(habit_id: int, db: AsyncSession = Depends(get_session), user_id: int = Depends(get_current_user)):
    habit = await db.get(Habit, habit_id)
    if habit is None or habit.user_id != user_id:
        raise HTTPException(status_code=404, detail="Habit not found")
    await db.delete(habit)
    await db.commit()
    return {"detail": "Habit deleted"}

# Выполнение привычки
@router.post("/{habit_id}/set", response_model=HabitLogRead)
async def toggle_habit_log(habit_id: int, log_data: HabitLogToggle, db: AsyncSession = Depends(get_session), user_id: int = Depends(get_current_user)):
    habit = await db.get(Habit, habit_id)
    if habit is None or habit.user_id != user_id:
        raise HTTPException(status_code=404, detail="Habit not found")
    log_date = log_data.date or date.today()

    result = await db.execute(
        select(HabitLog).where(HabitLog.habit_id == habit_id, HabitLog.date == log_date)
    )
    existing_log = result.scalar_one_or_none()
    if existing_log:
        await db.delete(existing_log)
        await db.commit()
        raise HTTPException(status_code=200, detail="Habit log removed for this date")
    else:
        habit_log = HabitLog(habit_id=habit_id, date=log_date, completed=True)
        db.add(habit_log)
        await db.commit()
        await db.refresh(habit_log)
        return habit_log

@router.get("/{habit_id}/logs", response_model=list[HabitLogRead])
async def get_habit_logs(habit_id: int, db: AsyncSession = Depends(get_session), user_id: int = Depends(get_current_user)):
    habit = await db.get(Habit, habit_id)
    if habit is None or habit.user_id != user_id:
        raise HTTPException(status_code=404, detail="Habit not found")
    result = await db.execute(
        select(HabitLog).where(HabitLog.habit_id == habit_id)
    )
    return result.scalars().all()