# 🚀 InfraPulse: BRICS DPI Feedback-to-Funding Platform

<p align="center">
  <img src="https://img.shields.io/badge/Status-Complete-brightgreen" alt="Status" />
  <img src="https://img.shields.io/badge/Hackathon-Build_With_AI-blue" alt="Hackathon" />
  <img src="https://img.shields.io/badge/Theme-Innovation-purple" alt="Theme" />
</p>

## 📌 The Problem
Governments often struggle to consolidate citizen feedback and align it with national infrastructure priorities. Development requests live in fragmented systems, leading to misaligned public spending, unaddressed infrastructure gaps, and no way to measure the impact of large-scale digital public infrastructure initiatives.

## 🎯 The Solution
**InfraPulse** is a scalable, multilingual AI platform—designed as a Digital Public Good—that aggregates citizen development requests via voice, text, and messaging apps across diverse linguistic regions. 

The system analyzes large datasets combining citizen feedback with national demographic data, infrastructure indices, and public investment plans. It surfaces demand hotspots and recommends high-priority development projects to national policymakers across BRICS nations.

---

## 🏗️ Architecture & Tech Stack

### Frontend (Citizen & Policymaker UIs)
- **Framework:** Next.js (App Router), React 18, TypeScript
- **Styling:** Tailwind CSS + Shadcn UI
- **Citizen UI (`/`):** Progressive Web App (PWA), Multilingual i18n support, Web Audio API integration.
- **Policymaker Dashboard (`/dashboard`):** Leaflet.js interactive GeoJSON maps, Recharts for predictive demand models and velocity charts.

### Backend (API & Orchestration)
- **Framework:** FastAPI (Python 3.11+), Pydantic v2
- **Audio Pipeline:** `ffmpeg-python` for async audio processing
- **Analytics:** PostGIS geospatial querying and predictive data serving.
- **Database:** PostgreSQL with PostGIS extension for spatial querying.

### Core AI Engine
- **Framework:** C/C++ compiled binaries (`pybind11` / `ctypes`)
- **Speech-to-Text:** `whisper.cpp` for native, fast inference *(Architecture modeled)*
- **NLP Engine:** `llama.cpp` for Intent categorization *(Architecture modeled)*

---

## 🚀 Getting Started (Docker Compose)

The easiest way to spin up the entire **InfraPulse** stack is using Docker Compose. This will start the PostgreSQL/PostGIS database, the FastAPI backend, and the Next.js frontend.

1. **Clone the repository:**
   ```bash
   git clone https://github.com/airz-raj/InfraPlus.git
   cd InfraPlus
   ```

2. **Spin up the stack:**
   ```bash
   docker-compose up --build -d
   ```

3. **Access the application:**
   - **Citizen Portal (Frontend):** [http://localhost:3000](http://localhost:3000)
   - **Policymaker Dashboard:** [http://localhost:3000/dashboard](http://localhost:3000/dashboard)
   - **Backend API Docs (Swagger):** [http://localhost:8000/docs](http://localhost:8000/docs)

---

## ⚠️ Residual Risks & Future Work
As a hackathon prototype, certain constraints were implemented:
1. **C++ Native AI Bindings:** The `ai_engine` folder contains the C++ `pybind11` architecture required to interface with `whisper.cpp` and `llama.cpp` on low-resource edge servers. However, due to compilation times and hardware constraints during the hackathon, the Python pipeline (`ai_pipeline.py`) currently uses mocked fallbacks. For production, the C++ binaries must be fully compiled using the provided `CMakeLists.txt`.
2. **Predictive Models:** The regression algorithms for the 6-month predictive forecast charts on the Policymaker Dashboard are currently serving deterministic/mocked trajectory data for the MVP. Future iterations will fully hook into Scikit-learn endpoints.
3. **Database Migrations:** Alembic should be configured for robust database migrations in production, though SQLModel/SQLAlchemy `create_all()` suffices for this MVP.

---

## 📜 License
This project is licensed under the MIT License.
