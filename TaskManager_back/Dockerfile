FROM python:3.11

WORKDIR /app

COPY pyproject.toml poetry.lock* /app/

RUN pip install poetry && \
    poetry config virtualenvs.create false && \
    poetry install --no-root --no-interaction --no-ansi

COPY . /app/

CMD bash -c "alembic upgrade head && uvicorn app.main:app --host 0.0.0.0 --port 8000"