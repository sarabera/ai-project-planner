# AI Project Planner

Transform project ideas into complete, production-ready software development plans using AI.

![Landing Page](./docs/screenshots/landing-page.png)

## Overview

AI Project Planner is a full-stack web application that helps software developers, startup founders, students, and entrepreneurs turn a project idea into a comprehensive development plan. Enter your idea, select your constraints, and receive a detailed markdown plan covering architecture, tech stack, database design, API endpoints, roadmap, costs, and more.

**Example input:** "I want to build an AI-powered hotel booking platform."

**Generated sections include:**
- Project Overview & Problem Statement
- Target Users & Core Features
- Recommended Tech Stack & System Architecture
- Database Design & Folder Structure
- API Endpoints & Development Roadmap
- Deployment Plan, Timeline & Cost Estimation
- Future Enhancements, Risks & Difficulty Rating

## Features

- **AI-powered plan generation** — Structured prompts tailored to industry, budget, project type, and experience level
- **Modern SaaS UI** — Landing page, planner workspace, and history management
- **Markdown rendering** — Beautiful formatted output with syntax highlighting
- **Export options** — Copy to clipboard, download as Markdown or PDF
- **Plan history** — Save, view, regenerate, and delete previous plans
- **Dark mode** — System-aware theme with manual toggle
- **Responsive design** — Works on desktop, tablet, and mobile
- **Toast notifications** — User feedback for all actions
- **Form validation** — Client and server-side validation

## Architecture

```
┌─────────────────┐     REST API      ┌─────────────────┐
│  React Frontend │ ◄──────────────► │  FastAPI Backend │
│  (Vercel)       │                   │  (Render)        │
└─────────────────┘                   └────────┬────────┘
                                               │
                                      ┌────────▼────────┐
                                      │  SQLite DB      │
                                      └────────┬────────┘
                                               │
                                      ┌────────▼────────┐
                                      │  Gemini API     │
                                      └─────────────────┘
```

### Backend Structure

```
backend/
├── app/
│   ├── api/           # Route handlers
│   ├── services/      # Business logic (Gemini, history)
│   ├── models/        # SQLAlchemy ORM models
│   ├── schemas/       # Pydantic request/response schemas
│   ├── database/      # Async DB connection
│   └── prompts/       # AI prompt templates
├── main.py
└── requirements.txt
```

### Frontend Structure

```
frontend/
├── src/
│   ├── components/    # UI components (shadcn/ui)
│   ├── pages/         # Landing, Planner, History
│   ├── lib/           # API client, utilities
│   ├── hooks/         # Theme, toast hooks
│   └── types/         # TypeScript interfaces
└── package.json
```

## Tech Stack

| Layer    | Technologies                                      |
|----------|---------------------------------------------------|
| Frontend | React, TypeScript, Tailwind CSS, shadcn/ui, Vite  |
| Backend  | Python, FastAPI, Pydantic, SQLAlchemy             |
| AI       | Google Gemini 2.5 Flash (free tier via AI Studio) |
| Database | SQLite (async via aiosqlite)                      |
| Deploy   | Vercel (frontend), Render (backend), Docker     |

## Prerequisites

- **Node.js** 18+ and npm
- **Python** 3.11+
- **Gemini API key** — [Get a free key here](https://aistudio.google.com/apikey)

## Setup Instructions

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd "AI project planer"
```

### 2. Backend setup

```bash
cd backend
python -m venv venv

# Windows
venv\Scripts\activate

# macOS/Linux
source venv/bin/activate

pip install -r requirements.txt
cp .env.example .env
```

Edit `backend/.env` and set your Gemini API key:

```env
GEMINI_API_KEY=your-key-here
GEMINI_MODEL=gemini-2.5-flash
DATABASE_URL=sqlite+aiosqlite:///./planner.db
CORS_ORIGINS=http://localhost:5173
```

Start the backend:

```bash
uvicorn main:app --reload --port 8000
```

API docs available at [http://localhost:8000/docs](http://localhost:8000/docs)

### 3. Frontend setup

```bash
cd frontend
npm install
cp .env.example .env
```

Edit `frontend/.env`:

```env
VITE_API_URL=http://localhost:8000
```

Start the frontend:

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

## Environment Variables

### Backend (`backend/.env`)

| Variable         | Required | Default                          | Description                    |
|------------------|----------|----------------------------------|--------------------------------|
| `GEMINI_API_KEY` | Yes      | —                                | Your Google Gemini API key     |
| `GEMINI_MODEL`   | No       | `gemini-2.5-flash`               | Gemini model to use            |
| `DATABASE_URL`   | No       | `sqlite+aiosqlite:///./planner.db` | SQLite connection string   |
| `CORS_ORIGINS`   | No       | `http://localhost:5173`          | Comma-separated allowed origins |

### Frontend (`frontend/.env`)

| Variable       | Required | Default                  | Description          |
|----------------|----------|--------------------------|----------------------|
| `VITE_API_URL` | No       | `http://localhost:8000`  | Backend API base URL |

## API Endpoints

| Method | Endpoint              | Description                |
|--------|-----------------------|----------------------------|
| POST   | `/api/generate-plan`  | Generate a new plan        |
| GET    | `/api/history`        | List all saved plans       |
| GET    | `/api/history/{id}`   | Get a single plan          |
| POST   | `/api/save`           | Save a plan to history     |
| DELETE | `/api/history/{id}`   | Delete a plan              |
| GET    | `/health`             | Health check               |

## Screenshots

> Place your screenshots in `docs/screenshots/`

| Page     | Screenshot                                      |
|----------|-------------------------------------------------|
| Landing  | `docs/screenshots/landing-page.png`             |
| Planner  | `docs/screenshots/planner-page.png`             |
| History  | `docs/screenshots/history-page.png`             |
| Dark Mode| `docs/screenshots/dark-mode.png`                |

## Docker

Run the full stack with Docker Compose:

```bash
# Set your Gemini key
export GEMINI_API_KEY=your-key-here

docker-compose up --build
```

- Frontend: [http://localhost:5173](http://localhost:5173)
- Backend: [http://localhost:8000](http://localhost:8000)

## Deployment Guide

### Frontend — Vercel

1. Push the repo to GitHub
2. Import the project in [Vercel](https://vercel.com)
3. Set **Root Directory** to `frontend`
4. Add environment variable:
   - `VITE_API_URL` = your Render backend URL (e.g. `https://your-api.onrender.com`)
5. Deploy

The included `vercel.json` handles SPA routing.

### Backend — Render

1. Push the repo to GitHub
2. Create a new **Web Service** on [Render](https://render.com)
3. Connect the repo and set **Root Directory** to `backend`
4. Use these settings:
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `uvicorn main:app --host 0.0.0.0 --port $PORT`
5. Add environment variables:
   - `GEMINI_API_KEY` — your API key from Google AI Studio
   - `CORS_ORIGINS` — your Vercel frontend URL
6. Deploy

Alternatively, use the included `render.yaml` Blueprint.

### Post-deployment checklist

- [ ] Set `CORS_ORIGINS` on backend to your frontend URL
- [ ] Set `VITE_API_URL` on frontend to your backend URL
- [ ] Verify `/health` endpoint responds
- [ ] Test plan generation end-to-end

## Development

```bash
# Backend lint/type check
cd backend && python -m compileall .

# Frontend build
cd frontend && npm run build

# Frontend preview (production build)
cd frontend && npm run preview
```

## License

MIT
