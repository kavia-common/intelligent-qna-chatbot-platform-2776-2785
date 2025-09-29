# QnA Frontend (React)

A modern React application implementing the Ocean Professional theme with:
- Authentication (login/signup)
- Chat interface (messages, input)
- Conversation history (sidebar)
- Integration with backend REST APIs

## Configuration

You must ensure the frontend points to the correct backend API base URL and that the Authorization header is preserved across requests.

1) Create an `.env` file (based on `.env.example`):
   cp .env.example .env

2) Set `REACT_APP_API_BASE` to your backend API base URL, including the `/api` suffix. Examples:
   - Local dev: `REACT_APP_API_BASE=http://localhost:8000/api`
   - In this environment: `REACT_APP_API_BASE=https://vscode-internal-10999-beta.beta01.cloud.kavia.ai:3001/api`

If this is not set and the app is served from a different origin/port than the backend, requests default to `/api` relative to the frontend origin. Without a proper dev proxy, requests won’t reach the backend and may result in 401/404.

3) Rebuild the app after changing `.env`:
   - For CRA-style build, env vars are read at build time. Restart `npm start` after editing `.env`.

## Auth behavior

- Upon successful login, the app stores tokens in `localStorage` under keys:
  - `access` (JWT access token)
  - `refresh`
  - `user` (JSON of basic user fields)
- The Axios client automatically sets `Authorization: Bearer <access>` for every request when a token exists.
- In development, the console logs a small debug line before each request (without printing the token) to help confirm the base URL and whether the Authorization header is present.

## Verifying 401 issues end-to-end

If you see 401 Unauthorized on chat requests:

- Open DevTools → Network and inspect the failing request:
  - Confirm the Request URL starts with your `REACT_APP_API_BASE` (e.g., `https://…:3001/api/chat/`).
  - Confirm the Request Headers contain `Authorization: Bearer <token>`.
- Confirm `localStorage.getItem('access')` returns a non-empty token string.
- If you updated `.env`, ensure you restarted the dev server so the new base URL is applied.
- If the token is expired or invalid, log out and log back in to refresh it.

## Quick start

1. Install dependencies
   npm install

2. Configure env
   cp .env.example .env
   # edit REACT_APP_API_BASE if your backend isn't proxied at /api

3. Run
   npm start

## API endpoints used

- POST {REACT_APP_API_BASE}/auth/login/
- POST {REACT_APP_API_BASE}/auth/signup/
- GET  {REACT_APP_API_BASE}/conversations/
- POST {REACT_APP_API_BASE}/conversations/
- GET  {REACT_APP_API_BASE}/conversations/{id}/
- DELETE {REACT_APP_API_BASE}/conversations/{id}/
- POST {REACT_APP_API_BASE}/chat/

## Theming

Theme can be toggled in the header. Styles in src/App.css follow blue (primary) and amber (secondary) accents with subtle shadows and gradients.
