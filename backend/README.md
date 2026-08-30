# Tarini API — Backend Service

SIH 2026 Problem Statement #26097: AI Voice Livelihood Assessment Platform

## Overview
FastAPI backend powering speech-to-text (Groq Whisper v3), fuzzy phrase variation matching, NSQF course alignment, and SQLite profile management.

---

## Local Setup & Execution

1. **Create Environment File**:
   ```bash
   cp .env.example .env
   ```
   Add your Groq API key from [console.groq.com/keys](https://console.groq.com/keys) to `.env`:
   ```env
   GROQ_API_KEY=gsk_...
   ```

2. **Install Dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

3. **Run Dev Server**:
   ```bash
   uvicorn main:app --reload --port 8000
   ```
   * Interactive Docs: [http://localhost:8000/docs](http://localhost:8000/docs)
   * Health Check: [http://localhost:8000/api/health](http://localhost:8000/api/health)

---

## Free Cloud Deployment (Render / Railway)

Because GitHub Pages only hosts static frontend files, deploy this backend to Render or Railway:

### Option A: Render (Free Tier)
1. Go to [dashboard.render.com](https://dashboard.render.com/) and click **New Web Service**.
2. Connect your GitHub repository (`Tarini`).
3. Set **Root Directory** to `backend`.
4. Set **Environment** to `Python 3`.
5. Set **Build Command**: `pip install -r requirements.txt`
6. Set **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`
7. In **Environment Variables**, add `GROQ_API_KEY` = your Groq key.
8. Copy the deployed backend URL (e.g. `https://tarini-api.onrender.com`) and set it in your frontend configuration.

### Option B: Railway (Free Tier)
1. Go to [railway.app](https://railway.app/) and create a new project from your GitHub repo.
2. Select the `backend` directory.
3. Add `GROQ_API_KEY` under Variables.
4. Deploy!

---

## API Endpoints Summary

* `GET /api/health`: Health status.
* `POST /api/transcribe`: Speech-to-Text via Groq Whisper (`audio` binary file upload).
* `POST /api/chat`: Natural language fuzzy phrase matching & course recommendations.
* `GET /api/courses`: List all NSQF QP code courses.
* `GET /api/occupations`: List reference occupation clusters.
* `GET /api/schemes`: Curated government scheme & portal links.
* `POST /api/profile`: Save candidate profile to SQLite.
* `GET /api/profile/{user_id}`: Retrieve profile.
