# Ajaia Docs AI Workflow

## AI tools used

Codex was used as an engineering pair for repository scaffolding, repetitive model and schema construction, API/client contract alignment, test-case generation, deployment troubleshooting, and first-pass documentation. Standard local tooling—Pytest, TypeScript, Vite, pip, npm, Alembic, and Docker Compose validation—was used to verify generated and edited output.

## Where AI accelerated implementation

AI reduced time spent on predictable setup: FastAPI route shells, SQLAlchemy model wiring, Pydantic response types, React component scaffolding, TipTap toolbar commands, Docker files, and sample integration tests. It also helped trace deployment failures involving Psycopg driver selection and browser CORS preflights.

## AI output that was changed

Generated code was revised after review and execution. Examples include moving authorization checks into reusable backend services, fixing SQLAlchemy joined-load result handling, normalizing Render PostgreSQL URLs to the Psycopg 3 dialect, replacing ambiguous button utility overrides with explicit variants, and clearing TanStack Query state between authenticated users.

Documentation was edited to reflect the actual product and its limitations rather than presenting generic claims.

## AI output that was rejected

The following ideas were intentionally not accepted:

- Real-time collaboration, WebSockets, CRDTs, or live cursors
- Premature repository and permission-framework abstractions
- Autosave before reliable manual-save behavior
- Claims that deployment, screenshots, or browser walkthroughs were complete without evidence
- Custom regular-expression Markdown parsing
- Frontend-only authorization as a security boundary

## Backend authorization review

The authenticated user is derived exclusively from the JWT. Document ownership is read from the database, and shared access is resolved through DocumentShare records. Owners can manage shares and delete; shared editors can read, rename, and edit; unrelated users receive HTTP 403 for known documents. Integration tests cover collaborator editing, collaborator delete denial, and unrelated-user denial.

## File-upload verification

Upload handling validates the filename extension, actual byte count, UTF-8 decoding, empty content, and null bytes. Reads are capped at 2 MB plus one byte so the size check does not rely on an untrusted request header. Tests verify valid text import and unsupported-type rejection.

## UX review

The primary reviewer flow was checked from login through dashboard, editor, import, sharing, logout, and account switching. Loading, empty, error, unsaved, saving, and saved states are visible. Owner-only actions are hidden for shared editors. Account-specific query data is cleared during login and logout to prevent one user's document list appearing in another user's session.

## Automated verification

The project uses:

- Pytest integration tests for persistence, import, sharing, and authorization
- Strict TypeScript type checking
- Vite production builds
- Alembic migration execution
- Docker Compose configuration validation

AI suggestions were treated as drafts. A change was considered complete only after relevant checks passed or the remaining manual verification was documented.

## Final correctness process

The final pass compared the implementation against the original acceptance criteria, ran backend and frontend checks, tested deployment-specific configuration, and documented anything requiring external action. Live hosting, screenshots, and the recorded walkthrough remain human-owned submission steps.
