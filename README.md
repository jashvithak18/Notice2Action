# Notice2Action

Turn confusing official notices into clear next steps.

🚀 **Live App:** [https://notice2action.onrender.com](https://notice2action.onrender.com)

## Problem

People receive long, formal notices from schools, government departments, banks, insurance companies, tax authorities, and utilities. These notices are hard to parse — deadlines get buried, eligibility is unclear, and it's not obvious what action to take next.

## Solution

Notice2Action converts any notice into a structured breakdown:

**Understand → Identify deadlines → Check eligibility → Take action**

Paste or upload a notice, and get a plain-language summary, extracted deadlines, eligibility conditions, and an interactive action checklist.

## Live Deployment

- **Live URL:** [https://notice2action.onrender.com](https://notice2action.onrender.com)
- **API Health Check:** [https://notice2action.onrender.com/api/health](https://notice2action.onrender.com/api/health)

## Features

- Notice input via paste, upload, or drag-and-drop
- TXT and text-based PDF support
- AI-powered summary and structured extraction
- Deadline extraction with context
- Eligibility extraction (only when stated in the notice)
- Interactive action checklist with session persistence
- Two realistic sample notices for demo
- Demo-resilient fallback for sample notices if AI is unavailable
- MongoDB history (optional — app works without it)

## Tech Stack

**Frontend:** React, Vite, Tailwind CSS, Framer Motion, Lucide React

**Backend:** Node.js, Express.js

**Database:** MongoDB Atlas with Mongoose

**AI:** Groq API / OpenAI API with structured JSON output

## Architecture

```
User → React frontend → Express API → Groq LLM (structured JSON)
                                    → MongoDB Atlas (history save)
                    ← validated analysis ←
```

1. User pastes or uploads a notice on the frontend.
2. Frontend sends text to `POST /api/analyze`.
3. Backend validates input and calls the LLM with a strict JSON schema.
4. Response is validated with Zod before returning.
5. If MongoDB is connected, the analysis is saved for history.
6. Frontend renders summary, deadlines, eligibility, and checklist.

## Running Locally

### Prerequisites

- Node.js 18+
- MongoDB Atlas or local MongoDB
- Groq / OpenAI API key

### Setup

```bash
# Clone and install
cd notice2action
npm run install:all

# Configure environment in .env
OPENAI_API_KEY=gsk_...
MONGODB_URI=mongodb+srv://...
VITE_API_URL=https://notice2action.onrender.com
```

### Development

```bash
# From project root — runs backend and frontend concurrently
npm run dev
```

- Frontend: http://localhost:5173
- Backend: http://localhost:5000
- Live Production: https://notice2action.onrender.com

## Environment Variables

| Variable | Description | Default / Value |
|----------|-------------|-----------------|
| `OPENAI_API_KEY` | Groq or OpenAI API key for notice analysis | `gsk_...` |
| `OPENAI_MODEL` | Model to use | `groq/compound` |
| `MONGODB_URI` | MongoDB connection string | MongoDB Atlas URI |
| `PORT` | Backend port | `5000` |
| `VITE_API_URL` | Backend URL for frontend | `https://notice2action.onrender.com` |

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/analyze` | Analyze notice text |
| `POST` | `/api/upload` | Upload TXT or PDF file |
| `GET` | `/api/samples` | List sample notices |
| `GET` | `/api/samples/:id` | Get sample notice text |
| `GET` | `/api/history` | List saved analyses |
| `GET` | `/api/history/:id` | Get single saved analysis |
| `GET` | `/api/health` | Health check |
