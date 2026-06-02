.PHONY: dev install migrate seed test lint

dev:
	uv run uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

install:
	uv sync

migrate:
	uv run alembic upgrade head

migration:
	uv run alembic revision --autogenerate -m "$(name)"

seed:
	uv run python scripts/seed.py

test:
	uv run pytest

lint:
	uv run ruff check app/
