# MiniTweet Lite

A minimal Twitter-like feed built with a Laravel REST API and a React + Vite + Tailwind frontend. Users can register and log in, post short tweets (max 280 chars), view a global feed, and like/unlike tweets.

## Tech Stack
- Backend: Laravel 12 + Sanctum (cookie-based auth), Breeze API scaffolding
- Frontend: React 19, Vite 7, Tailwind CSS 4
- Testing (optional): Pest/PHPUnit for backend, Vitest/Jest for frontend

## Monorepo Layout
```
minitweet-lite/
  backend/   # Laravel API
  frontend/  # React + Vite SPA
```

## Prerequisites
- PHP 8.2+
- Composer
- Node.js 18+
- A MySQL instance (Laragon local defaults are fine)

## Backend Setup (Laravel)
From `backend/`:

1) Install deps and env
```
composer install
copy .env.example .env
php artisan key:generate
```

2) Configure `.env` (Laragon defaults)
```
APP_URL=http://localhost:8000
FRONTEND_URL=http://localhost:5173

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=minitweet_lite
DB_USERNAME=root
DB_PASSWORD=

SESSION_DRIVER=file
SESSION_DOMAIN=null
SESSION_SECURE_COOKIE=false
SANCTUM_STATEFUL_DOMAINS=localhost:5173,localhost:8000
```

3) Migrate
```
php artisan migrate
```

4) Serve API
```
php artisan serve --host=localhost --port=8000
```

Notes
- CORS is configured in `backend/config/cors.php` with credentials on and the SPA origin allowed.
- CSRF flow: the SPA calls `/sanctum/csrf-cookie` before `/login` or `/register`.

## Frontend Setup (React + Vite + Tailwind)
From `frontend/`:

1) Install deps
```
npm i
```

2) Env for API base URL
```
# frontend/.env
VITE_API_URL=http://localhost:8000
```

3) Dev server
```
npm run dev
```

The SPA runs at `http://localhost:5173`.

## Core Endpoints (auth + tweets)
- `POST /login` (Sanctum/Breeze)
- `POST /register`
- `POST /logout`
- `GET /api/user` (current user)
- `GET /api/tweets` (paginated feed)
- `POST /api/tweets` (create, body max 280)
- `POST /api/tweets/{tweet}/like` (like)
- `DELETE /api/tweets/{tweet}/like` (unlike)

## Implementation Notes
- Auth is cookie-based via Sanctum (stateful SPA). Axios is configured with credentials, XSRF header, and an interceptor to mirror the CSRF cookie.
- Tweets enforce 280 chars client-side and validated server-side (`StoreTweetRequest`).
- Deterministic avatars use DiceBear with a stable seed (user email fallback to id) so each user keeps the same avatar.
- Feed like/unlike is optimistic and swaps the heart icon accordingly.

## Running Tests (optional)
Backend (from `backend/`):
```
php artisan test
```
Frontend (from `frontend/`): add tests and run:
```
npm run test
```

## Conventional Commits
Example messages used in this repo:
- `feat(backend): add tweets and likes with API routes`
- `fix(backend): include user email in tweet response`
- `feat(frontend): add router and pages (login, register, feed)`
- `feat(frontend): axios client with CSRF + auth/tweet services`
- `feat(frontend): protected route for feed`
- `feat(frontend): deterministic avatars and like/unlike toggle`
- `fix(frontend): enforce 280-char limit and wrap long text`
- `docs: add project README with setup and usage`

## Quick Start
1) Start backend at `http://localhost:8000`
2) Start frontend at `http://localhost:5173`
3) Register a new account, log in, post a tweet, like/unlike

## License
MIT
