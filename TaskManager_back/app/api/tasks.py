from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.schemas.task import TaskCreate, TaskRead, TaskUpdate
from app.models.task import Task
from app.db.session import get_session
from app.utils.jwt import get_current_user

router = APIRouter()

@router.post("/", response_model=TaskRead)
async def create_task(task: TaskCreate, db: AsyncSession = Depends(get_session), user_id: int = Depends(get_current_user)):
    db_task = Task(**task.dict(), user_id=user_id)
    db.add(db_task)
    await db.commit()
    await db.refresh(db_task)
    return db_task

@router.get("/", response_model=list[TaskRead])
async def read_tasks(db: AsyncSession = Depends(get_session), user_id: int = Depends(get_current_user)):
    result = await db.execute(select(Task).where(Task.user_id == user_id))
    return result.scalars().all()

@router.get("/{task_id}", response_model=TaskRead)
async def get_task(task_id: int, db: AsyncSession = Depends(get_session), user_id: int = Depends(get_current_user)):
    task = await db.get(Task, task_id)
    if task is None or task.user_id != user_id:
        raise HTTPException(status_code=404, detail="Task not found")
    return task

@router.put("/{task_id}", response_model=TaskRead)
async def update_task(task_id: int, task_data: TaskUpdate, db: AsyncSession = Depends(get_session), user_id: int = Depends(get_current_user)):
    task = await db.get(Task, task_id)
    if task is None or task.user_id != user_id:
        raise HTTPException(status_code=404, detail="Task not found")
    # Только переданные данные обновляем
    for key, value in task_data.dict(exclude_unset=True).items():
        setattr(task, key, value)
    await db.commit()
    await db.refresh(task)
    return task

@router.delete("/{task_id}")
async def delete_task(task_id: int, db: AsyncSession = Depends(get_session), user_id: int = Depends(get_current_user)):
    task = await db.get(Task, task_id)
    if task is None or task.user_id != user_id:
        raise HTTPException(status_code=404, detail="Task not found")
    await db.delete(task)
    await db.commit()
    return {"detail": "Task deleted"}