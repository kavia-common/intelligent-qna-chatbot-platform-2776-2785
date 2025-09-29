# QnA Frontend (React)

A modern React application implementing the Ocean Professional theme with:
- Authentication (login/signup)
- Chat interface (messages, input)
- Conversation history (sidebar)
- Integration with backend REST APIs

## Quick start

1. Install dependencies
   npm install

2. Configure env (optional)
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

Tokens are stored in localStorage under keys: access, refresh, user.

## Theming

Theme can be toggled in the header. Styles in src/App.css follow blue (primary) and amber (secondary) accents with subtle shadows and gradients.

