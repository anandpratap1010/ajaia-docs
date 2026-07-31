# Ajaia Docs

Lightweight collaborative document editor built as a deliberately scoped full-stack assignment. It supports rich-text writing, persistence, text/Markdown import, and owner-controlled sharing.

## Working features

- Seeded JWT login and session restoration
- Owned and shared document dashboards
- Create, rename, edit, save, reopen, and delete
- TipTap bold, italic, underline, headings, lists, undo, and redo
- Manual save with dirty, saving, saved, and error states
- UTF-8 .txt and .md imports up to 2 MB
- Sharing with existing users and access revocation
- Backend-enforced owner, editor, and unrelated-user permissions
- SQLite locally and PostgreSQL through configuration
- Integration tests for persistence, sharing, authorization, and import

## Screenshots

Add deployment screenshots to the screenshots directory. No fabricated screenshots are included.

## Stack

React, TypeScript, Vite, Tailwind, TanStack Query, TipTap, React Hook Form, Zod, and Axios on the frontend. FastAPI, SQLAlchemy 2, Pydantic, Alembic, JWT, and Pytest on the backend. See ARCHITECTURE.md for design decisions.

## Local setup

Requires Python 3.12+ and Node.js 20+.

~~~bash
cd backend
python -m venv .venv
# Windows: .venv\Scripts\activate
# macOS/Linux: source .venv/bin/activate
pip install -r requirements.txt
copy .env.example .env
alembic upgrade head
python -m app.db.seed
uvicorn app.main:app --reload
~~~

In another terminal:

~~~bash
cd frontend
npm install
copy .env.example .env
npm run dev
~~~

On macOS/Linux replace copy with cp. Open http://localhost:5173. API docs are at http://localhost:8000/docs and health is at http://localhost:8000/health.

The API also creates missing local tables and idempotently seeds users at startup. Alembic is the explicit production migration path.

## Docker

~~~bash
docker compose up --build
docker compose down
docker compose down -v
~~~

The final command also resets the database volume. Frontend, API, and PostgreSQL use ports 5173, 8000, and 5432.

## Tests and builds

~~~bash
cd backend
pytest
cd ../frontend
npm run typecheck
npm run build
~~~

Tests use a disposable SQLite database.

## Demo accounts

All accounts use Password123!.

| Role | Email |
|---|---|
| Owner | owner@ajaia.demo |
| Collaborator | collaborator@ajaia.demo |
| Reviewer | reviewer@ajaia.demo |

Passwords are stored as bcrypt hashes. The documented password is only for disposable demo identities.

## Environment

Backend: DATABASE_URL, JWT_SECRET_KEY, JWT_ALGORITHM, ACCESS_TOKEN_EXPIRE_MINUTES, CORS_ORIGINS, and ENVIRONMENT.

Frontend: VITE_API_BASE_URL, including the /api/v1 suffix.

## Deployment

Deploy frontend/ to Vercel and set VITE_API_BASE_URL. Deploy backend/ with its Dockerfile to Render or Railway, attach PostgreSQL, set backend variables, run alembic upgrade head, and allow the exact frontend origin through CORS. Verify /health and then replace placeholders in SUBMISSION.md.

The backend pins Python 3.12.8 through backend/.python-version so Render installs compatible binary database-driver wheels consistently.

## Known limitations

No real-time editing, comments, history, offline mode, public links, email invitations, export, OAuth, or PDF/DOCX import. Markdown import preserves common block structure but simplifies complex inline formatting. Local-storage JWT is a timeboxed demo decision; production should use secure HTTP-only cookies and CSRF protection.

## Troubleshooting

- CORS errors usually mean CORS_ORIGINS does not exactly match the frontend origin.
- A 401 after refresh means the token expired or the JWT secret changed.
- Reset SQLite by stopping the API, removing backend/ajaia_docs.db, and rerunning migration and seed.
- If PostgreSQL cannot start, confirm port 5432 is available.

Next improvements: cookie auth, richer Markdown conversion, browser tests, request-safe autosave, and deployment smoke tests.
