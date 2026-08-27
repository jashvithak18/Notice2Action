# Notice2Action — Product Requirements Document (PRD)

**Project:** Notice2Action — AI-Powered Universal Notice & Document Simplifier  
**Version:** 2.0 (Post-Hackathon Production Specification)  
**Status:** Implemented & Verified  

---

## 1. Problem Statement
Official notices from government bodies, courts, tax authorities, insurance providers, employers, and educational institutions are deliberately composed in dense, archaic legalese. Everyday citizens, parents, employees, and tenants face significant challenges:
- **Comprehension Deficit:** Reading difficulty often exceeds 16th-grade levels, obscuring what the document actually demands.
- **Buried Deadlines:** Crucial 3-day, 10-day, or 30-day response windows are hidden in fine-print paragraphs.
- **Consequential Inaction:** Missing deadlines leads to default court judgments, utility disconnections, severe tax penalties, lost scholarship subsidies, or forfeited appeal rights.
- **Action Paralysis:** Standard translators only rephrase words; they do not extract what concrete steps the recipient must take.

**Notice2Action** solves this by transforming any uploaded or pasted notice into a plain-language summary, key takeaways, hard deadlines, eligibility conditions, and an interactive action checklist in under 1 second.

---

## 2. Target Users & Personas
- **Everyday Consumers & Taxpayers:** Individuals facing IRS CP2000 letters, property tax adjustments, or municipal citations.
- **Tenants & Homeowners:** Renters dealing with 3-day lease cure notices, HOA violation warnings, or utility shutoff alerts.
- **Parents & Students:** Families parsing complex school fee circulars, capstone consent slips, and financial aid cutoffs.
- **Employees & Small Business Owners:** Workers reviewing mandatory IT compliance faxes, HR benefits open-enrollment, or vendor contract defaults.

---

## 3. Core Features & Capabilities
1. **Universal Multi-Format Ingestion:** Direct text pasting, camera photos/scans (OCR), Word documents (`.docx`), PDFs, and workplace faxes up to 15MB.
2. **Plain-Language Summary (8th-Grade Readability):** 3–5 sentence synthesis explaining what happened and what is at stake.
3. **Important Things to Remember:** Distinct bulleted highlights covering critical caveats, consequences, and warnings.
4. **Extracted Deadlines & Timelines:** Automated identification of explicit dates (*"September 14, 2026"*) and relative cutoffs (*"Within 15 days"*).
5. **Eligibility & Legal Rights:** Breakdown of fee waiver rules, appeal paths, and qualifying criteria.
6. **Interactive Action Checklist:** Step-by-step to-do list with real-time completion progress tracking and 1-click clipboard export.
7. **Document Persistence (MongoDB Atlas):** Non-blocking asynchronous notice archiving.

---

## 4. Technologies Used

### **4.1 Frontend Layer**
- **Core Framework:** React 18 with Vite (Ultra-fast HMR and optimized production bundles).
- **Typography & Theme:** Times New Roman Editorial Design System with Luxury Maroon (`#731126`) and Warm Offwhite (`#fbf9f6`) palette.
- **Layout Architecture:** Widescreen 2-column laptop dashboard (`max-width: 1420px`) with 100% fluid mobile/tablet responsiveness.
- **Iconography:** Lucide React (`Lucide-Icons`).
- **Styling Paradigm:** Plain CSS with CSS Custom Properties (Design Tokens), zero external UI framework bloat.

### **4.2 Backend Layer**
- **Runtime Environment:** Node.js (v20+ LTS).
- **Web Framework:** Express.js (REST API, CORS middleware, centralized error handling).
- **File Upload & Streaming:** Multer with in-memory buffer storage (zero disk I/O latency).
- **Security & Protection:** `express-rate-limit` (Server-side IP rate limiter for API key token protection).
- **Environment Management:** `dotenv` configuration.

### **4.3 AI Inference & Large Language Models**
- **Primary AI Provider:** **Groq LPU API** (Language Processing Unit inference delivering ~800ms response times).
- **Models Utilized:** `openai/gpt-oss-120b`, `qwen/qwen3.8-27b`, `qwen/qwen3.6-27b`.
- **Secondary / Fallback AI Provider:** Anthropic Claude API (`claude-sonnet-4-6`).
- **Structured Output Protocol:** Strict JSON schema mode enforcing deterministic response shapes.

### **4.4 Document Processing & Optical Character Recognition (OCR)**
- **Image OCR Engine:** `tesseract.js` (WebAssembly-based in-memory OCR supporting `.png`, `.jpg`, `.jpeg`, `.webp`, `.bmp`, `.tiff`).
- **Word Document Parser:** `mammoth` (Raw text extraction from `.docx` and `.doc` binaries).
- **PDF Extraction Engine:** `pdf-parse` (Extracts digital text layers with automated OCR fallback for scanned image PDFs).

### **4.5 Database & Infrastructure**
- **Database:** MongoDB Atlas (Cloud Multi-Region Cluster).
- **Object Data Modeling:** Mongoose ODM (Async non-blocking persistence).
- **Version Control & Hosting:** Git, GitHub, Vite Dev Server (port 3000), Node Express Server (port 5000).

---

## 5. Implementation Details

```
                                  ┌────────────────────────────────┐
                                  │   User Interface (React 18)    │
                                  │  - Text Paste                  │
                                  │  - Photo / OCR Upload          │
                                  │  - Word (.docx) & PDF Upload   │
                                  └───────────────┬────────────────┘
                                                  │ POST /api/analyze
                                                  ▼
                                  ┌────────────────────────────────┐
                                  │     Express.js API Router      │
                                  │  - IP Rate Limiting (5/15m)    │
                                  │  - Multer In-Memory Storage    │
                                  └───────────────┬────────────────┘
                                                  │
                 ┌────────────────────────────────┴────────────────────────────────┐
                 │                                                                 │
                 ▼ (If Binary File)                                                ▼ (If Raw Text)
   ┌──────────────────────────────┐                                                │
   │ File Parser Service          │                                                │
   │ - Images -> Tesseract OCR    │                                                │
   │ - Word   -> Mammoth Parser   │                                                │
   │ - PDF    -> pdf-parse / OCR  │                                                │
   └─────────────┬────────────────┘                                                │
                 │ Extracted Raw Text                                              │
                 └────────────────────────────────┬────────────────────────────────┘
                                                  │
                                                  ▼
                                  ┌────────────────────────────────┐
                                  │       LLM Service (Groq)       │
                                  │  - System Prompt Schema        │
                                  │  - LPU Sub-Second Inference    │
                                  │  - JSON Schema Normalizer      │
                                  └───────────────┬────────────────┘
                                                  │
                         ┌────────────────────────┴────────────────────────┐
                         │                                                 │
                         ▼ (Immediate Sync Response)                       ▼ (Non-Blocking Async)
          ┌─────────────────────────────┐                    ┌───────────────────────────┐
          │  5-Tier Structured Payload  │                    │ MongoDB Atlas Persistence │
          │  - Summary                  │                    │ (Notice Collection)       │
          │  - Important Takeaways      │                    └───────────────────────────┘
          │  - Extracted Deadlines      │
          │  - Eligibility & Rights     │
          │  - Interactive Checklist    │
          └─────────────────────────────┘
```

### **5.1 In-Memory Document Ingestion Pipeline**
To guarantee user privacy and maximize processing speed, uploaded files are processed entirely in memory without writing temporary files to disk:
- **Images:** Buffers are passed directly to `tesseract.js` WebAssembly workers.
- **Word Files:** Buffers are parsed via `mammoth.extractRawText({ buffer })`.
- **PDFs:** Binary buffers are inspected by `pdf-parse`. If the text layer is empty (indicating a scanned flat PDF), the buffer is routed to OCR automatically.

### **5.2 Strict Schema Normalization & Sanitization**
The LLM response is validated via `validateAnalysisResult` in `backend/utils/jsonSchema.js`. This prevents runtime rendering bugs by guaranteeing:
- Array properties (`deadlines`, `importantToRemember`, `eligibility`, `checklist`) are always normalized into sanitized string or object formats.
- String conversion prevents `[object Object]` leakage across all client-side cards.

### **5.3 Dual-Endpoint Resilient Client Routing**
The frontend API client (`frontend/src/api/analyzeApi.js`) utilizes intelligent URL resolution:
- Routes through Vite's `/api` proxy in development and preview modes.
- Automatically falls back to `http://localhost:5000/api/analyze` if proxy headers are missing, ensuring uninterrupted zero-downtime execution.

---

## 6. Future Scope & Roadmap

### **Phase 1: Calendar & Workflow Automation (Short Term)**
- **1-Click Calendar Sync:** Export extracted deadlines directly into Google Calendar, Apple iCal, and Microsoft Outlook (`.ics` generation).
- **Automated Reminder Notifications:** Browser push notifications and email/SMS alerts 48 hours and 24 hours prior to deadline cutoffs.

### **Phase 2: Multi-Language & Vernacular Accessibility (Medium Term)**
- **Global & Regional Translation:** Real-time translation of summaries and checklists into 25+ languages (Spanish, Hindi, Mandarin, Arabic, Bengali, French, Tagalog).
- **Voice Synthesis / Screen Reader Mode:** Text-to-speech audio playback for visually impaired or low-literacy users.

### **Phase 3: Automated Action Drafting & Agency Integration (Long Term)**
- **AI Response Letter Generator:** 1-click drafting of formal dispute letters, penalty abatement requests (IRS Form 843), or landlord cure notices.
- **Official Agency API Integrations:** Direct links to state legal aid databases, IRS e-file portals, and court dispute filing systems.
- **Mobile Native Application:** iOS and Android native apps with live camera viewfinder scanning and on-device machine learning OCR.

---

## 7. References & Bibliography

1. **Plain Writing Act of 2010 (Public Law 111-274):** U.S. Federal guidelines and standards for clear government communication. *Plain Language Action and Information Network (PLAIN)*. [https://www.plainlanguage.gov](https://www.plainlanguage.gov)
2. **Groq LPU™ Inference Engine Architecture:** High-throughput Language Processing Units for low-latency AI inference. *Groq Documentation*. [https://groq.com](https://groq.com)
3. **Smith, Ray (2007):** *An Overview of the Tesseract OCR Engine*. Ninth International Conference on Document Analysis and Recognition (ICDAR 2007), IEEE.
4. **Nielsen, Jakob (1994):** *Enhancing the Explanatory Power of Usability Heuristics*. ACM CHI '94 Conference Proceedings.
5. **Mozilla Developer Network (MDN):** *Web APIs, FormData, and CSS Grid Layout Specifications*. [https://developer.mozilla.org](https://developer.mozilla.org)
6. **Express.js Security Best Practices:** Production guidelines for middleware, rate limiting, and CORS configuration. [https://expressjs.com](https://expressjs.com)
7. **Anthropic Claude API Reference:** Prompt engineering and structured JSON generation documentation. [https://docs.anthropic.com](https://docs.anthropic.com)
