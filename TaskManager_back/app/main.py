from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from app.api import tasks, notes, habit, auth, projects, events, search

app = FastAPI(title="Task Manager API")

# Настройки CORS
origins = [
    "http://localhost:3000",  # Адрес фронта на React
    "http://127.0.0.1:3000",  # Альтернатива для localhost
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/auth", tags=["Auth"])
app.include_router(auth.router, prefix="/user", tags=["Auth"])
app.include_router(tasks.router, prefix="/tasks", tags=["Tasks"])
app.include_router(notes.router, prefix="/notes", tags=["Notes"])
app.include_router(habit.router, prefix="/habits", tags=["Habits"])
app.include_router(projects.router, prefix="/projects", tags=["Projects"])
app.include_router(events.router, prefix="/events", tags=["Events"])
app.include_router(search.router, prefix="/search", tags=["Search"])
app.mount("/uploaded_files", StaticFiles(directory="uploaded_files"), name="files")