# Tandarust AI

Tandarust AI is a comprehensive healthcare application designed to assist medical professionals with patient triage, prescription digitization, and health risk assessment using advanced AI technologies.

## 🚀 Key Features

- **AI-Powered Triage**: Automatically prioritizes patients based on urgency scores (0-100) and clinical reasoning using Google Gemini.
- **Prescription Digitization**: Converts handwritten prescriptions into structured JSON data using Gemini Vision API.
- **Health Risk Prediction**: Analyzes patient data to predict potential health risks.
- **Doctor Dashboard**: A centralized interface for managing patients, prescriptions, and viewing aggregate statistics.
- **Clinical Summaries**: Generates concise, doctor-ready summaries of patient conditions.

## 🏗️ Tech Stack

### Frontend

- **Framework**: React 19 (Vite)
- **UI Library**: Shadcn/UI, Radix UI
- **Styling**: Tailwind CSS, PostCSS
- **Animations**: Framer Motion
- **State Management/Data**: Axios, React Router v7
- **Type Safety**: TypeScript

### Backend

- **Framework**: FastAPI (Python)
- **Database & Auth**: Supabase (PostgreSQL, Auth, Storage)
- **AI/LLM**: Google Gemini 2.0 Flash (Text + Vision)
- **ORM/Data Validation**: Pydantic

## 📂 Project Structure

```
.
├── frontend/          # React frontend application
├── backend/           # FastAPI backend application
└── README.md          # Project documentation
```

## 🛠️ Getting Started

Follow these steps to set up the project locally.

### Prerequisites

- Node.js & npm
- Python 3.8+
- A Supabase project
- Google Gemini API Key

### Backend Setup

1.  Navigate to the backend directory:

    ```bash
    cd backend
    ```

2.  Install Python dependencies:

    ```bash
    pip install -r requirements.txt
    ```

3.  Configure environment variables:
    - Copy `.env.example` to `.env`.
    - Fill in `SUPABASE_URL`, `SUPABASE_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, and `GEMINI_API_KEY`.

4.  Run Supabase migrations:
    - Execute the SQL commands from `backend/supabase_migration.sql` in your Supabase project's SQL Editor.

5.  Start the backend server:
    ```bash
    uvicorn app.main:app --reload --port 8000
    ```
    The API will be available at `http://localhost:8000`. API Docs at `http://localhost:8000/docs`.

### Frontend Setup

1.  Navigate to the frontend directory:

    ```bash
    cd frontend
    ```

2.  Install Node dependencies:

    ```bash
    npm install
    ```

3.  Start the development server:
    ```bash
    npm run dev
    ```
    The application will run at `http://localhost:5173`.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).
