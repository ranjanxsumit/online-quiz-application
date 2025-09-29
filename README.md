# Online Quiz Application

A full-stack quiz experience where users can take a short trivia quiz, beat the timer, submit their answers, and instantly see how they did question-by-question.

## Project Structure

```
backend/   # Express API + SQLite database and tests
frontend/  # React + Vite single-page quiz client
```

## Prerequisites

- Node.js 18+
- npm 9+

> SQLite is bundled with the project via `better-sqlite3`; no separate installation is required.

## Getting Started

### 1. Backend API

```powershell
cd backend
npm install
npm run seed
npm run dev
```

- The API listens on `http://localhost:4000` by default.
- `npm run seed` creates `backend/data/quiz.db` and loads sample quiz content.

### 2. Frontend Client

```powershell
cd frontend
npm install
npm run dev
```

- Vite serves the app on `http://localhost:5173` by default.
- The frontend expects the backend at `http://localhost:4000`. To point it elsewhere, create `frontend/.env` with:
  ```env
  VITE_API_BASE_URL=http://localhost:4000
  ```

## Running Tests

```powershell
cd backend
npm test
```

The Jest suite currently focuses on the scoring logic to guarantee reliable grading outcomes.

## Features

- Quiz data lives in SQLite with clear quiz/question/option tables.
- REST endpoints:
  - `GET /api/quizzes/:quizId/questions` hides the correct answers while serving options.
  - `POST /api/quizzes/:quizId/submit` evaluates the submission and returns a per-question breakdown.
- React frontend flow: start screen → timed quiz → results summary with correct/incorrect indicators.
- Countdown timer automatically submits when it hits zero.

## Assumptions & Design Choices

Speaking from my point of view while building this project:

1. I focused on a single demo quiz (`quizId = 1`) to keep the UI and seed script straightforward.
2. I chose Express with `better-sqlite3` because it gives me a fast, zero-config database layer that still supports SQL queries.
3. I went with Vite + React for a lightweight SPA setup, which made it easy to manage quiz state and the countdown timer.
4. I kept the timer at two minutes; it feels long enough to read questions but short enough to create urgency.
5. I return a detailed breakdown from the backend so the frontend can highlight correct vs. incorrect choices without duplicating scoring logic.

## Future Enhancements

- Add user authentication to track scores over time.
- Support multiple quizzes with a catalog view.
- Persist submissions so users can revisit past attempts.
