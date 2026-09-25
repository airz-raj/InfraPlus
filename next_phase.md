# 🚀 Next Phase: Phase 3 (The API Layer)

## 📋 Context
We are building **InfraPulse** (a BRICS DPI Feedback-to-Funding Platform).
- **Phase 1 (Done):** Infrastructure & Database setup (PostgreSQL + PostGIS, SQLAlchemy models).
- **Phase 2 (Done):** High-Performance AI Pipeline (C++ `pybind11` bindings for STT and NLP, and Python async `audio_service.py` and `ai_pipeline.py`).

We are now ready for **Phase 3: The API Layer**.

---

## 🤖 Directives for the AI Agent (READ FIRST)
You are taking over from another AI agent. Your task is to execute Phase 3 of the hackathon project based on the current monorepo architecture. 

**Strict Constraints:**
1. **Framework:** FastAPI (Python 3.11+).
2. **Concurrency:** All I/O routes must be asynchronous (`async def`). Do not block the event loop.
3. **Data Validation:** Use Pydantic v2 schemas for requests and responses.
4. **Error Handling:** Graceful fallback if processing fails (e.g., mark status as `REVIEW_REQUIRED`).

### Your Tasks for Phase 3:
1. **Scaffold FastAPI Application:**
   - Create `backend/main.py` initializing the FastAPI app.
   - Setup basic CORS middleware.
   
2. **Feedback Endpoint (`POST /api/v1/feedback`):**
   - Create a router file `backend/api/routes/feedback.py`.
   - The endpoint must accept `multipart/form-data` (audio files) or JSON (text).
   - If audio, use `backend/services/audio_service.py` and `backend/services/ai_pipeline.py` to extract intent.
   - Save the interaction to the PostgreSQL database using the `Interaction` model defined in `backend/models/schema.py`.

3. **Analytics Hotspots Endpoint (`GET /api/v1/analytics/hotspots`):**
   - Create a router file `backend/api/routes/analytics.py`.
   - Query the database and return GeoJSON data combining citizen complaints with current budget data (`InfrastructureProject` model).

4. **Wiring & Execution:**
   - Include the routers in `backend/main.py`.
   - Ensure the server runs smoothly with Uvicorn.

5. **Post-Completion:**
   - After successfully completing Phase 3 and committing to the repo, **update this `next_phase.md` file** with the instructions for **Phase 4: Citizen Frontend (Web App)**.

---

## 🧑‍💻 Instructions for the Human Teammate
1. **Review Code:** Check the `backend/services/` and `ai_engine/bindings/` directories to see how the AI pipeline is structured.
2. **Prompt your Agent:** Feed this `next_phase.md` file to your AI agent and instruct it to begin working on Phase 3 based on the directives above.
3. **Test:** Once your agent finishes, run the backend server (`cd backend && uvicorn main:app --reload`) and test the endpoints via the Swagger UI at `http://localhost:8000/docs`.
4. **Commit:** Ensure your agent commits the work and updates this file for the next hand-off!
