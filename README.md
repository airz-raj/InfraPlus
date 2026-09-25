# 🚀 InfraPulse: BRICS DPI Feedback-to-Funding Platform

<p align="center">
  <img src="https://img.shields.io/badge/Status-Active-brightgreen" alt="Status" />
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
- **Key Features:** Progressive Web App (PWA), Multilingual i18n support, Web Audio API, Leaflet.js/Mapbox for geospatial heatmaps.

### Backend (API & Orchestration)
- **Framework:** FastAPI (Python 3.11+), Pydantic v2
- **Audio Pipeline:** `ffmpeg-python` for async audio processing
- **Analytics:** Pandas, GeoPandas, Scikit-learn
- **Database:** PostgreSQL with PostGIS extension for spatial queries

### Core AI Engine
- **Framework:** C/C++ compiled binaries (`pybind11` / `ctypes`)
- **Speech-to-Text:** `whisper.cpp` for native, fast inference
- **NLP Engine:** `llama.cpp` for Intent categorization and Named Entity Recognition

---

## ⚙️ Monorepo Directory Layout

```text
/infrapulse-monorepo
├── frontend/                 # Next.js Web App
├── backend/                  # FastAPI Python Server
├── ai_engine/                # Native processing (C/C++)
└── infrastructure/           # Docker, DB Init scripts
```

---

## 🚀 Getting Started

### Prerequisites
- Docker & Docker Compose
- Python 3.11+
- Node.js 18+

### Development Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/airz-raj/InfraPlus.git
   cd InfraPlus
   ```

2. **Start the Database Infrastructure:**
   Spin up the PostgreSQL database with PostGIS:
   ```bash
   docker-compose up -d
   ```

3. **Install Backend Dependencies:**
   ```bash
   cd backend
   pip install -r requirements.txt
   ```

*(Further steps to run frontend and the AI Engine will be added as the project scales!)*

---

## 🤝 Contributing
Contributions are always welcome as we continue to build out InfraPulse for the community. Please follow standard fork and pull-request workflows.

## 📜 License
This project is licensed under the MIT License.
