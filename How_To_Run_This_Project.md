# How to Run CrowdMind
# How to Run CrowdMind

This document outlines the step-by-step instructions for running the CrowdMind project locally. The project consists of a Python FastAPI backend and a React/Vite web frontend.

---

## Prerequisites

Ensure you have the following installed on your system:
- **Node.js** (v22+ recommended)
- **Python** (v3.12+ recommended)
- **PostgreSQL** (v16+)
- **Redis**

---

## 1. Running the Backend (FastAPI)

1. **Navigate to the backend directory**:
   ```bash
   cd backend
   ```

2. **Activate the Python virtual environment**:
   - **Windows (PowerShell)**:
     ```powershell
     .venv\Scripts\activate
     ```
   - **Windows (Command Prompt)**:
     ```cmd
     .venv\Scripts\activate.bat
     ```
   - **macOS/Linux**:
     ```bash
     source .venv/bin/activate
     ```

3. **Install python dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

4. **Run database migrations** (if applicable):
   ```bash
   alembic upgrade head
   ```

5. **Start the FastAPI server**:
   ```bash
   python -m uvicorn app.main:app --host 0.0.0.0 --port 8001
   ```
   *The backend API will run on **`http://localhost:8001`**.*

---

## 2. Running the Frontend (React & Vite)

1. **Navigate to the frontend web directory**:
   ```bash
   cd web
   ```

2. **Install Node dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```
   *The frontend application will run on **`http://localhost:5173`**.*

---

## Environment Variables

Make sure to configure the `.env` file in the `backend/` directory with the necessary keys (like database URL, Redis URL, Clerk keys, and Gemini API keys) before running the project. Refer to `.env.example` in `backend/` for details.
