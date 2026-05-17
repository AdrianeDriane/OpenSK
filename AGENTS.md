# AGENTS.md

Guidance for coding agents working in this repository.

## Project Overview

OpenSK is a full-stack TypeScript app for SK/barangay workflows.

- `client/`: React 19 + Vite frontend, React Router routes, Tailwind CSS v4 styling, Axios API client.
- `server/`: Express 5 API, Prisma 7 with PostgreSQL, Google OAuth via Passport, JWT auth, local upload storage.
- `.agents/`: local agent assets, including the `frontend-redesigner` skill for UI-only redesign work.

There are no root-level npm scripts. Run commands from `client/` or `server/`.

## Common Commands

Client:

```powershell
cd client
npm install
npm run dev
npm run build
npm run lint
```

Server:

```powershell
cd server
npm install
npm run dev
npm run build
npm run prisma:generate
npm run prisma:migrate:deploy
```

Prisma seed is configured in `server/prisma.config.ts` as:

```powershell
cd server
npx prisma db seed
```

## Environment

The client API base URL is read from `VITE_API_URL` and requests go to `${VITE_API_URL}/api`.

The server reads environment variables in `server/src/config/env.ts`:

- `PORT`
- `NODE_ENV`
- `CLIENT_URL`
- `DATABASE_URL`
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `GOOGLE_CALLBACK_URL`
- `JWT_SECRET`

Do not commit real secrets. If adding env documentation, prefer examples/placeholders.

## Architecture Notes

### Client

- App routes live in `client/src/App.tsx`.
- Page components live in `client/src/pages/`.
- Shared UI components are grouped under `client/src/components/`.
- API wrappers live in `client/src/api/`; use the shared Axios instance in `client/src/api/axios.ts` so JWT headers are applied consistently.
- Theme behavior is centralized in `client/src/theme/applyTheme.ts` and related theme components.
- Global styles are in `client/src/index.css`; keep the Google font import above the Tailwind import and do not remove the existing Tailwind import comments.

### Server

- API entry point is `server/src/index.ts`.
- Routes live in `server/src/routes/` and should delegate request logic to controllers in `server/src/controllers/`.
- Auth middleware is in `server/src/middlewares/auth.middleware.ts`.
- Prisma client setup is in `server/src/db/prisma.ts`, importing the generated client from `server/prisma/generated/client`.
- Database schema and migrations live under `server/prisma/`.
- Uploaded files are stored locally under `server/uploads` at runtime and served from `/uploads`; use helpers in `server/src/utils/local-storage.ts` for upload paths and deletion.

## Coding Conventions

- Keep TypeScript changes consistent with nearby files. This repo uses semicolons and double quotes.
- Prefer existing route/controller/service patterns before introducing new abstractions.
- Preserve the client/server separation. Do not import server code into the client or client code into the server.
- For authenticated frontend requests, use the shared Axios client instead of creating ad hoc `fetch` calls.
- For protected backend routes, use `requireAuth` or `requireRole` as appropriate.
- When touching Prisma models, add a migration and regenerate the Prisma client.
- Avoid broad refactors unless needed for the requested change.

## UI Guidance

- Use Tailwind utility classes already present in the app.
- Use `lucide-react` for icons when an icon is needed.
- Preserve existing routing, API calls, auth guards, and user workflows during visual changes.
- For layout-only redesign tasks, use the local `frontend-redesigner` skill in `.agents/skills/frontend-redesigner/`.

## Testing And Verification

There is currently no dedicated test script. At minimum, run the relevant checks before handing off:

- Client changes: `npm run lint` and `npm run build` from `client/`.
- Server changes: `npm run build` from `server/`.
- Prisma/schema changes: `npm run prisma:generate` and the appropriate migration command from `server/`.

If a command cannot be run because dependencies, services, or environment variables are missing, report that explicitly.

## Git And File Hygiene

- Do not revert user changes or unrelated work.
- Keep generated/build output out of commits unless the repo already tracks it intentionally.
- Do not commit `node_modules`, `.env`, local upload files, or build directories.
- Before editing, check whether the file has existing uncommitted changes and preserve them.

