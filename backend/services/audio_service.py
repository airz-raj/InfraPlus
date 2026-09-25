import asyncio
import os
import ffmpeg

async def normalize_audio(input_path: str, output_path: str) -> str:
    """
    Asynchronously normalizes an audio file to 16kHz WAV format using ffmpeg-python.
    """
    def _run_ffmpeg():
        (
            ffmpeg
            .input(input_path)
            .output(output_path, ac=1, ar='16000', format='wav')
            .overwrite_output()
            .run(quiet=True)
        )
    
    # Run CPU/IO bound ffmpeg process in a separate thread to not block the event loop
    await asyncio.to_thread(_run_ffmpeg)
    return output_path
