# 🚀 Next Phase: Phase 3 (The API Layer)

## 📋 Context
We are building **InfraPulse** (a BRICS DPI Feedback-to-Funding Platform).
- **Phase 1 (Done):** Infrastructure & Database setup (PostgreSQL + PostGIS, SQLAlchemy models).
- **Phase 2 (Done):** High-Performance AI Pipeline (C++ `pybind11` bindings for STT and NLP, and Python async `audio_service.py` and `ai_pipeline.py`).

We are now ready for **Phase 3: The API Layer**.

---

## 🤖 1. Directives for the AI Agent (READ FIRST)
You are taking over from another AI agent. Your primary task is to execute Phase 3 of the hackathon project based on the current monorepo architecture. 

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

---

## 🔄 2. SELF-REPLICATING WORKFLOW COMMAND (MANDATORY FINAL STEP)
**AGENT INSTRUCTION:** This workflow relies on continuous, automated hand-offs. 
Before you end your session and report completion to the user, you **MUST** overwrite this exact file (`next_phase.md`) to prepare the context for the agent taking over the *next* phase.

**Upon completing Phase 3, you must:**
1. Read the `agent_implementation_guide_readme.md` to understand the requirements for **Phase 4: Citizen Frontend (Web App)**.
2. Overwrite this `next_phase.md` file. Your new version must include:
   - The updated context (noting Phase 3 is done).
   - The specific tasks and technical constraints for Phase 4.
   - **CRITICAL:** You must include this exact "SELF-REPLICATING WORKFLOW COMMAND" section in your new file, ensuring you instruct the *next* agent to prepare the file for Phase 5. 
3. Commit and push all changes (including the updated `next_phase.md`) to the repository.

---

## 🧑‍💻 Instructions for the Human Teammate
1. **Pull changes:** Run `git pull origin main` to get the latest state.
2. **Prompt your Agent:** Instruct your AI agent to "Read and execute the instructions in `next_phase.md`".
3. **Verify:** Once your agent finishes its work, it will automatically update this file for the next phase. You can then test the code and safely hand the repository over to the next team member.
