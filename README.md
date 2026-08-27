# Notice2Action

Turn confusing official notices into clear next steps.

## Problem

People receive long, formal notices from schools, government departments, banks, insurance companies, tax authorities, and utilities. These notices are hard to parse — deadlines get buried, eligibility is unclear, and it's not obvious what action to take next.

## Solution

Notice2Action converts any notice into a structured breakdown:

**Understand → Identify deadlines → Check eligibility → Take action**

Paste or upload a notice, and get a plain-language summary, extracted deadlines, eligibility conditions, and an interactive action checklist.

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

**Database:** MongoDB with Mongoose (optional)

**AI:** OpenAI API with structured JSON output

## Architecture

```
User → React frontend → Express API → OpenAI (structured JSON)
                                    → MongoDB (optional save)
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
- MongoDB (optional, for history)
- OpenAI API key (optional for samples — fallback works without it)

### Setup

```bash
# Clone and install
cd notice2action
npm run install:all

# Configure environment
cp .env.example .env
# Edit .env with your OPENAI_API_KEY and optionally MONGODB_URI
```

### Development

```bash
# From project root — runs backend and frontend concurrently
npm run dev
```

- Frontend: http://localhost:5173
- Backend: http://localhost:5000

Or run separately:

```bash
cd backend && npm run dev
cd frontend && npm run dev
```

### Production Build

```bash
cd frontend && npm run build
```

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `OPENAI_API_KEY` | OpenAI API key for notice analysis | Yes (except sample fallback) |
| `OPENAI_MODEL` | Model to use (default: `gpt-4o-mini`) | No |
| `MONGODB_URI` | MongoDB connection string | No |
| `PORT` | Backend port (default: `5000`) | No |
| `VITE_API_URL` | Backend URL for frontend (default: proxied in dev) | No |

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

## Limitations

- **Text-based PDFs only** — scanned or image PDFs are not supported (no OCR)
- **No authentication** — history is stored without user accounts
- **AI output should be verified** — always check dates and requirements against the original notice
- **Sample fallback** — predefined analyses are used only when a sample notice is submitted and the AI service fails

## Demo Tips

1. Click **Try a sample** to load a realistic university or government notice.
2. Click **Analyze Notice** to see the full breakdown.
3. Check off items in the action checklist.
4. Expand **View original notice** to verify source transparency.
