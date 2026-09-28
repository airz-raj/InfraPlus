# 🧠 AI Models Directory

This directory is intended to store the quantized model weights for native C++ edge inference.

### Why is it empty?
For this hackathon MVP, downloading multi-gigabyte LLM weight files isn't practical for rapid prototyping or running inside basic Docker containers. Instead, we implemented a robust fallback in `backend/services/ai_pipeline.py` that utilizes the **Gemini 2.5 Flash API** via the official `google-genai` SDK. This gives you the full, real AI experience without melting your local machine's memory.

### Edge Deployment (Production Architecture)
In a true production deployment on low-resource, off-grid government edge servers (the core value proposition of this DPI project), you would place your `.gguf` and `.bin` weights in this folder. 

For example, to download a quantized LLaMA model for `llama.cpp` inference:
```bash
wget https://huggingface.co/TheBloke/Llama-2-7B-Chat-GGUF/resolve/main/llama-2-7b-chat.Q4_K_M.gguf
```

To download a local Whisper model for offline Speech-to-Text:
```bash
wget https://huggingface.co/ggerganov/whisper.cpp/resolve/main/ggml-base.en.bin
```

Once downloaded, the C++ bindings in `../bindings` load these exact weights into memory.
