# 🚀 InfraPulse: BRICS DPI Feedback-to-Funding Platform
**Hackathon:** Build with AI : Code for Communities (Google) | **Track 1:** DPI & Governance

## 🤖 Directives for the AI Agent (READ FIRST)
You are acting as the lead full-stack and systems engineer for a Google Hackathon project. Your goal is to build a high-performance, production-ready Web App. 
**Strict Constraints:**
1. **Modularity:** Keep all components decoupled. Frontend (Next.js), Backend API (FastAPI), and AI Engine (C++/Python) must operate independently and communicate via strictly typed REST/WebSocket interfaces.
2. **Code Quality:** Enforce strict TypeScript, Python type hinting (`mypy`), and modular C++ with memory safety. Use early returns, meaningful variable names, and comprehensive inline documentation.
3. **Performance First:** The core value proposition is utilizing C/C++ binaries for fast AI inference on low-cost servers. Do not use heavy Python wrappers if native C++ bindings can be used. API routes must be asynchronous.
4. **Error Handling:** Implement global error boundaries on the frontend and centralized exception handlers in FastAPI. Never fail silently.

---

## 🏗️ 1. Architecture & Tech Stack

### Frontend (Citizen & Policymaker UIs)
* **Framework:** Next.js (App Router), React 18, strict TypeScript.
* **Styling:** Tailwind CSS + Shadcn UI (for accessible, modular components).
* **State Management:** Zustand (lightweight) or React Context.
* **Key Features:** Progressive Web App (PWA) config, multilingual i18n support, Web Audio API for recording, Leaflet.js/Mapbox for geospatial heatmaps.

### Backend (API & Orchestration)
* **Framework:** FastAPI (Python 3.11+), Pydantic v2 for validation.
* **Audio Pipeline:** `ffmpeg-python` for async audio normalization (convert to 16kHz WAV).
* **Analytics:** Pandas, GeoPandas, Scikit-learn (for regression/predictive demand modeling).
* **Database:** PostgreSQL with PostGIS extension (for spatial queries), mapped via SQLAlchemy or SQLModel.

### Core AI Engine (The Hackathon Edge)
* **Framework:** C/C++ compiled binaries interfacing with Python via `pybind11` or `ctypes`.
* **Models:** 
  * `whisper.cpp` for native, lightning-fast Speech-to-Text.
  * `llama.cpp` (or similar lightweight native inference) for NLP (Intent categorization, Named Entity Recognition).

---

## 📂 2. Monorepo Directory Layout

```text
/infrapulse-monorepo
├── /frontend                 # Next.js Web App
│   ├── /app                  # App Router (pages: /, /dashboard, /map)
│   ├── /components           # Reusable UI (Chatbot, Map, Charts)
│   ├── /lib                  # Utilities (API clients, i18n configs)
│   └── /types                # Shared TS Interfaces
├── /backend                  # FastAPI Python Server
│   ├── /api                  # Routes (/ingest, /analytics, /feedback)
│   ├── /core                 # Config, Security, DB connection
│   ├── /services             # Business logic (Audio parsing, DB CRUD)
│   └── /analytics            # Pandas/Scikit-learn modeling scripts
├── /ai_engine                # Native processing
│   ├── /src                  # C/C++ source code
│   ├── /models               # Quantized model weights (.bin/.gguf)
│   └── /bindings             # Python wrappers (pybind11/ctypes)
└── /infrastructure           # Docker, DB Init scripts (PostGIS)
```

---

## ⚙️ 3. Implementation Phases

### Phase 1: Infrastructure & Database Setup
1. Define the `docker-compose.yml` to spin up PostgreSQL + PostGIS.
2. Create the SQLAlchemy/SQLModel schemas in `/backend`.
   * **Tables needed:** `Users`, `Interactions` (text/audio ref, raw intent, extracted location, status), `Infrastructure_Projects` (planned budgets).
3. Ensure geospatial indexing is applied to location columns.

### Phase 2: High-Performance AI Pipeline (Backend)
1. Initialize the C++ bindings in `/ai_engine`.
2. Write a Python service that takes a raw audio file, runs it through `ffmpeg` (async), and passes the buffer to the C++ STT binding.
3. Write the NLP service that takes the transcription, feeds it to the C++ LLM binding, and returns a strict JSON payload: `{ "intent": "problem", "category": "water", "location": "lat,lng", "severity": 1-5 }`.

### Phase 3: The API Layer (Backend)
1. Scaffold FastAPI. Implement asynchronous routes.
2. Build the `POST /api/v1/feedback` endpoint. This must accept `multipart/form-data` (audio files) or JSON (text).
3. Build the `GET /api/v1/analytics/hotspots` endpoint to serve GeoJSON data to the frontend map, combining citizen complaints with current budget data.

### Phase 4: Citizen Frontend (Web App)
1. Scaffold Next.js. Implement strict Tailwind configuration.
2. Build the `Citizen Portal`: A mobile-first, lightweight chat interface.
3. Integrate browser Audio Recording API with visual feedback (waveforms).
4. Implement a local news/localization widget side-panel (mock external API integration if necessary, but keep the interface functional).

### Phase 5: Policymaker Dashboard (Web App)
1. Build the `Dashboard`: Data-dense layout for desktop.
2. Integrate interactive maps (Leaflet/Mapbox) rendering the GeoJSON from the backend.
3. Implement charts (Recharts or Chart.js) showing the Scikit-learn regression outputs (e.g., "Predicted Power Grid failures over the next 6 months based on complaint velocity").

---

## 🏆 4. Code Quality & Performance Standards
* **Concurrency:** Never block the FastAPI event loop. I/O bound tasks (FFmpeg, DB calls) must be `async`. CPU-bound tasks (AI inference) must be offloaded to `BackgroundTasks` or a worker pool (e.g., Celery/Redis if scaling, but `concurrent.futures` is fine for the hackathon MVP).
* **Accessibility (a11y):** The Next.js frontend MUST adhere to WCAG standards. ARIA labels on all chatbot inputs, high contrast ratios, and keyboard navigability are mandatory for a government DPG project.
* **Error Resilience:** If the AI engine fails to parse an intent, the backend must gracefully fallback to a "Manual Review Required" status rather than throwing a 500 error to the citizen. 

**Agent Instruction:** Begin execution with Phase 1. Do not proceed to the next phase until the previous phase's core functionality is written and verifiable.