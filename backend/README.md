# Tandarust AI — Backend

FastAPI backend for patient prioritization, prescription digitization, and health risk prediction.

## Tech Stack

- **Framework:** Python FastAPI
- **Database & Auth:** Supabase (PostgreSQL + Auth + Storage)
- **AI/LLM:** Google Gemini 2.0 Flash (text + vision)
- **OCR:** Gemini Vision API (no Tesseract needed)

## Project Structure

```
backend/
├── app/
│   ├── main.py              # FastAPI app entry point
│   ├── config.py            # Settings (.env loader)
│   ├── dependencies.py      # Supabase & Gemini singletons, auth dep
│   ├── models/              # Pydantic request/response schemas
│   │   ├── auth.py
│   │   ├── patient.py
│   │   ├── prescription.py
│   │   └── dashboard.py
│   ├── routers/             # API route handlers
│   │   ├── auth.py          # /api/auth/*
│   │   ├── patients.py      # /api/patients/*
│   │   ├── prescriptions.py # /api/prescriptions/*
│   │   └── dashboard.py     # /api/dashboard/*
│   ├── agents/              # AI agents (Gemini-powered)
│   │   ├── prioritization.py
│   │   ├── risk_analyzer.py
│   │   ├── prescription_ocr.py
│   │   └── summary.py
│   └── services/            # DB CRUD operations
│       ├── patient_service.py
│       ├── prescription_service.py
│       └── dashboard_service.py
├── supabase_migration.sql   # SQL to run in Supabase dashboard
├── requirements.txt
├── .env.example
└── README.md
```

## Setup

### 1. Install dependencies

```bash
cd backend
pip install -r requirements.txt
```

### 2. Configure environment

Copy `.env.example` to `.env` and fill in your keys:

```bash
cp .env.example .env
```

Required variables:

- `SUPABASE_URL` — from Supabase project settings
- `SUPABASE_KEY` — anon/public key
- `SUPABASE_SERVICE_ROLE_KEY` — service role key (Settings → API)
- `GEMINI_API_KEY` — from [Google AI Studio](https://aistudio.google.com/apikey)
- `FRONTEND_URL` — your frontend URL (default: `http://localhost:5173`)

### 3. Set up Supabase database

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor** and run the contents of `supabase_migration.sql`
3. Go to **Authentication → Providers** and enable **Google OAuth** (optional)
4. Go to **Storage** and verify the `prescription-images` bucket was created

### 4. Run the server

```bash
uvicorn app.main:app --reload --port 8000
```

The API will be available at `http://localhost:8000`.
Swagger docs at `http://localhost:8000/docs`.

## API Endpoints

### Authentication

| Method | Endpoint                 | Description                  |
| ------ | ------------------------ | ---------------------------- |
| POST   | `/api/auth/register`     | Register with email/password |
| POST   | `/api/auth/login`        | Login with credentials       |
| POST   | `/api/auth/refresh`      | Refresh access token         |
| GET    | `/api/auth/oauth/google` | Get Google OAuth URL         |
| GET    | `/api/auth/me`           | Get current user profile     |

### Patients (AI Triage)

| Method | Endpoint             | Description                       |
| ------ | -------------------- | --------------------------------- |
| POST   | `/api/patients`      | Create patient + run AI triage    |
| GET    | `/api/patients`      | List patients (sorted by urgency) |
| GET    | `/api/patients/{id}` | Get patient details               |
| DELETE | `/api/patients/{id}` | Delete patient                    |

### Prescriptions (OCR)

| Method | Endpoint                         | Description                          |
| ------ | -------------------------------- | ------------------------------------ |
| POST   | `/api/prescriptions/digitize`    | Upload image → OCR → structured data |
| GET    | `/api/prescriptions`             | List prescriptions                   |
| GET    | `/api/prescriptions/{id}`        | Get prescription                     |
| PATCH  | `/api/prescriptions/{id}/status` | Update status                        |

### Dashboard

| Method | Endpoint               | Description          |
| ------ | ---------------------- | -------------------- |
| GET    | `/api/dashboard/stats` | Aggregate statistics |

### Health

| Method | Endpoint      | Description  |
| ------ | ------------- | ------------ |
| GET    | `/api/health` | Health check |

## AI Agents

1. **Patient Prioritization Agent** — Scores urgency (0-100) with clinical reasoning
2. **Risk Analyzer Agent** — Predicts health risks with condition-specific scores
3. **Prescription Digitizer Agent** — OCR via Gemini Vision (handwritten → JSON)
4. **Summary Agent** — Generates concise doctor-ready clinical summaries
