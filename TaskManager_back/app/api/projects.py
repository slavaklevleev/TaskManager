from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import func, desc
from app.models.project import Project
from app.models.project_comment import ProjectComment
from app.models.project_file import ProjectFile
from app.models.task import Task
from app.schemas.project import ProjectCreate, ProjectRead, ProjectUpdate, ProjectBoardGroupedResponse
from app.schemas.project_comment import ProjectCommentCreate
from app.schemas.project_file import ProjectFileCreate
from app.db.session import get_session
from app.utils.jwt import get_current_user
from datetime import date, timedelta
import shutil
import os

router = APIRouter()


@router.get("/", response_model=ProjectBoardGroupedResponse)
async def get_all_projects(db: AsyncSession = Depends(get_session), user_id: int = Depends(get_current_user)):
    result = await db.execute(select(Project).where(Project.user_id == user_id))
    projects = result.scalars().all()

    grouped_projects = {
        "todo": [],
        "in_progress": [],
        "completed": []
    }

    for project in projects:
        grouped_projects[project.board.value].append(project)

    return grouped_projects


@router.post("/", response_model=ProjectRead)
async def create_project(project: ProjectCreate, db: AsyncSession = Depends(get_session), user_id: int = Depends(get_current_user)):
    db_project = Project(**project.dict(), user_id=user_id)
    db.add(db_project)
    await db.commit()
    await db.refresh(db_project)
    return db_project


@router.put("/{project_id}", response_model=ProjectRead)
async def update_project(project_id: int, project_data: ProjectUpdate, db: AsyncSession = Depends(get_session), user_id: int = Depends(get_current_user)):
    project = await db.get(Project, project_id)
    if project is None or project.user_id != user_id:
        raise HTTPException(status_code=404, detail="Project not found")

    for key, value in project_data.dict(exclude_unset=True).items():
        setattr(project, key, value)
        if (key == "board"):
            if (value == "completed"):
                setattr(project, "complete_date", date.today())
            else:
                setattr(project, "complete_date", None)

    await db.commit()
    await db.refresh(project)
    return project


@router.delete("/{project_id}")
async def delete_project(project_id: int, db: AsyncSession = Depends(get_session), user_id: int = Depends(get_current_user)):
    project = await db.get(Project, project_id)
    if project is None or project.user_id != user_id:
        raise HTTPException(status_code=404, detail="Project not found")
    await db.delete(project)
    await db.commit()
    return {"detail": "Project deleted"}


@router.post("/{project_id}/comments")
async def add_comment(project_id: int, comment: ProjectCommentCreate, db: AsyncSession = Depends(get_session), user_id: int = Depends(get_current_user)):
    db_project = await db.get(Project, project_id)
    if db_project is None or db_project.user_id != user_id:
        raise HTTPException(status_code=404, detail="Project not found")
    db_comment = ProjectComment(project_id=project_id, content=comment.content)
    db.add(db_comment)
    await db.commit()
    await db.refresh(db_comment)
    return db_comment


@router.delete("/comments/{comment_id}")
async def delete_comment(comment_id: int, db: AsyncSession = Depends(get_session), user_id: int = Depends(get_current_user)):
    comment = await db.get(ProjectComment, comment_id)
    if comment is None:
        raise HTTPException(status_code=404, detail="Comment not found")
    await db.delete(comment)
    await db.commit()
    return {"detail": "Comment deleted"}


@router.post("/{project_id}/files")
async def add_file(
    project_id: int,
    uploaded_file: UploadFile = File(...),
    db: AsyncSession = Depends(get_session),
    user_id: int = Depends(get_current_user)
):
    db_project = await db.get(Project, project_id)
    if db_project is None or db_project.user_id != user_id:
        raise HTTPException(status_code=404, detail="Project not found")

    # Папка для хранения файлов
    save_dir = "uploaded_files"
    os.makedirs(save_dir, exist_ok=True)
    file_location = os.path.join(save_dir, uploaded_file.filename)

    # Сохраняем файл
    with open(file_location, "wb") as buffer:
        shutil.copyfileobj(uploaded_file.file, buffer)

    # Запись в БД
    db_file = ProjectFile(project_id=project_id, file_path=file_location)
    db.add(db_file)
    await db.commit()
    await db.refresh(db_file)

    return {"file_id": db_file.id, "file_url": f"/files/{uploaded_file.filename}"}


@router.delete("/files/{file_id}")
async def delete_file(file_id: int, db: AsyncSession = Depends(get_session), user_id: int = Depends(get_current_user)):
    file = await db.get(ProjectFile, file_id)
    if file is None:
        raise HTTPException(status_code=404, detail="File not found")
    await db.delete(file)
    await db.commit()
    return {"detail": "File deleted"}


@router.get("/stats/tasks")
async def get_task_stats(db: AsyncSession = Depends(get_session), user_id: int = Depends(get_current_user)):
    result = []
    today = date.today()

    for i in range(11, -1, -1):  # последние 12 месяцев, начиная с текущего
        month_date = (today.replace(day=1) - timedelta(days=i * 30))
        month_start = month_date.replace(day=1)
        year = month_start.year % 100
        month_name = month_start.strftime("%b").capitalize() + f"'{year}"

        done = await db.scalar(
            select(func.count()).select_from(Project).where(
                Project.user_id == user_id,
                func.date_trunc('month', Project.due_date) == month_start,
                Project.complete_date != None
            )
        ) or 0

        failed = await db.scalar(
            select(func.count()).select_from(Project).where(
                Project.user_id == user_id,
                func.date_trunc('month', Project.due_date) == month_start,
                Project.complete_date == None
            )
        ) or 0

        result.append({"month": month_name, "done": done, "failed": failed})

    return result


@router.get("/stats/active")
async def get_active_tasks_stats(db: AsyncSession = Depends(get_session), user_id: int = Depends(get_current_user)):
    boards = {"todo": 'Не начаты', "in_progress": 'В работе', "completed": 'Выполнены'}
    stats = []
    
    for p in boards.keys():
        count = await db.scalar(
            select(func.count()).select_from(Project).where(
                Project.user_id == user_id,
                Project.board == p
            )
        ) or 0
        stats.append({"name": boards.get(p), "value": count})

    return stats
