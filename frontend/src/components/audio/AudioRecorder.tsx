"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Mic, Square, Trash2, Upload } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useI18n } from "@/components/providers";
import { cn } from "@/lib/utils";

type AudioRecorderProps = {
  disabled?: boolean;
  onSubmit: (blob: Blob) => void;
};

function formatDuration(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60)
    .toString()
    .padStart(2, "0");
  const seconds = (totalSeconds % 60).toString().padStart(2, "0");
  return `${minutes}:${seconds}`;
}

export function AudioRecorder({ disabled, onSubmit }: AudioRecorderProps) {
  const { t } = useI18n();
  const [recording, setRecording] = useState(false);
  const [elapsedMs, setElapsedMs] = useState(0);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const blobRef = useRef<Blob | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const rafRef = useRef<number | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const timerRef = useRef<number | null>(null);
  const startedAtRef = useRef<number>(0);

  const stopVisualizer = useCallback(() => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    if (audioContextRef.current) {
      void audioContextRef.current.close();
      audioContextRef.current = null;
    }
    if (timerRef.current !== null) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const releaseStream = useCallback(() => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
  }, []);

  const drawWaveform = useCallback((analyser: AnalyserNode) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const buffer = new Uint8Array(analyser.fftSize);
    const width = canvas.width;
    const height = canvas.height;

    const paint = () => {
      analyser.getByteTimeDomainData(buffer);
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = "transparent";
      ctx.fillRect(0, 0, width, height);
      ctx.lineWidth = 2;
      ctx.strokeStyle = "oklch(0.48 0.2 275)";
      ctx.beginPath();
      const slice = width / buffer.length;
      for (let i = 0; i < buffer.length; i += 1) {
        const x = i * slice;
        const y = (buffer[i] / 255) * height;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
      rafRef.current = requestAnimationFrame(paint);
    };

    paint();
  }, []);

  const startRecording = useCallback(async () => {
    setError(null);
    blobRef.current = null;
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }

    if (typeof MediaRecorder === "undefined" || !navigator.mediaDevices?.getUserMedia) {
      setError(t("micUnsupported"));
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const mimeType = MediaRecorder.isTypeSupported("audio/webm")
        ? "audio/webm"
        : undefined;
      const recorder = new MediaRecorder(stream, mimeType ? { mimeType } : undefined);
      mediaRecorderRef.current = recorder;
      chunksRef.current = [];

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) chunksRef.current.push(event.data);
      };
      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, {
          type: recorder.mimeType || "audio/webm",
        });
        blobRef.current = blob;
        setPreviewUrl(URL.createObjectURL(blob));
        releaseStream();
        stopVisualizer();
        setRecording(false);
      };

      const audioContext = new AudioContext();
      audioContextRef.current = audioContext;
      const source = audioContext.createMediaStreamSource(stream);
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 1024;
      source.connect(analyser);
      drawWaveform(analyser);

      startedAtRef.current = Date.now();
      setElapsedMs(0);
      timerRef.current = window.setInterval(() => {
        setElapsedMs(Date.now() - startedAtRef.current);
      }, 200);

      recorder.start(100);
      setRecording(true);
    } catch {
      setError(t("micDenied"));
      releaseStream();
      stopVisualizer();
    }
  }, [drawWaveform, previewUrl, releaseStream, stopVisualizer, t]);

  const stopRecording = useCallback(() => {
    const recorder = mediaRecorderRef.current;
    if (recorder && recorder.state !== "inactive") {
      recorder.stop();
    }
  }, []);

  const discard = useCallback(() => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    blobRef.current = null;
    setElapsedMs(0);
    setError(null);
  }, [previewUrl]);

  const submit = useCallback(() => {
    if (!blobRef.current) return;
    onSubmit(blobRef.current);
    discard();
  }, [discard, onSubmit]);

  useEffect(() => {
    return () => {
      stopVisualizer();
      releaseStream();
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl, releaseStream, stopVisualizer]);

  return (
    <div className="flex w-full flex-col gap-2">
      <div className="flex items-center gap-2">
        {!recording && !previewUrl ? (
          <Button
            type="button"
            variant="outline"
            size="icon"
            aria-label={t("record")}
            disabled={disabled}
            onClick={startRecording}
          >
            <Mic />
          </Button>
        ) : null}

        {recording ? (
          <Button
            type="button"
            variant="destructive"
            size="icon"
            aria-label={t("stopRecording")}
            onClick={stopRecording}
          >
            <span className="relative flex size-4 items-center justify-center">
              <span className="absolute inset-0 rounded-full bg-destructive/40 animate-pulse-ring" />
              <Square className="size-3 fill-current" />
            </span>
          </Button>
        ) : null}

        {previewUrl ? (
          <>
            <Button
              type="button"
              size="icon"
              aria-label={t("submitRecording")}
              disabled={disabled}
              onClick={submit}
            >
              <Upload />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              aria-label={t("discardRecording")}
              disabled={disabled}
              onClick={discard}
            >
              <Trash2 />
            </Button>
          </>
        ) : null}

        <p
          className="text-xs text-muted-foreground tabular-nums"
          aria-live="polite"
          aria-label={t("recordingDuration")}
        >
          {recording ? t("recording") : null} {formatDuration(elapsedMs)}
        </p>
      </div>

      <canvas
        ref={canvasRef}
        width={320}
        height={48}
        className={cn(
          "h-12 w-full rounded-md border border-border bg-muted/40",
          !recording && "opacity-40"
        )}
        role="img"
        aria-label={t("waveform")}
      />

      {previewUrl ? (
        <audio controls src={previewUrl} className="w-full" preload="metadata">
          {t("submitRecording")}
        </audio>
      ) : null}

      {error ? (
        <p role="alert" className="text-xs text-destructive">
          {error}
        </p>
      ) : null}
    </div>
  );
}
