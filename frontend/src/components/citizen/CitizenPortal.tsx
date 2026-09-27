"use client";

import { FormEvent, useId, useRef, useState } from "react";
import { Newspaper, Send } from "lucide-react";

import { AudioRecorder } from "@/components/audio/AudioRecorder";
import { LanguageSelector } from "@/components/i18n/LanguageSelector";
import { NewsPanel } from "@/components/news/NewsPanel";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/components/providers";
import { submitAudioFeedback, submitTextFeedback } from "@/lib/api";
import { getOptionalLocation } from "@/lib/geolocation";
import { interpolate } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import type { FeedbackResponse } from "@/types/api";

type ChatRole = "user" | "assistant";

type ChatItem = {
  id: string;
  role: ChatRole;
  text: string;
  kind?: "info" | "success" | "error";
};

function nextId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function formatSuccess(template: string, response: FeedbackResponse): string {
  return interpolate(template, {
    category: response.category,
    severity: response.severity,
    status: response.status,
  });
}

export function CitizenPortal() {
  const { t } = useI18n();
  const inputId = useId();
  const listRef = useRef<HTMLDivElement | null>(null);
  const [newsOpen, setNewsOpen] = useState(false);
  const [draft, setDraft] = useState("");
  const [busy, setBusy] = useState(false);
  const [messages, setMessages] = useState<ChatItem[]>(() => [
    {
      id: "welcome",
      role: "assistant",
      kind: "info",
      text: "",
    },
  ]);

  const push = (item: Omit<ChatItem, "id">) => {
    setMessages((current) => [...current, { ...item, id: nextId() }]);
    requestAnimationFrame(() => {
      listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
    });
  };

  const handleResponse = (response: FeedbackResponse) => {
    const body = formatSuccess(t("successBody"), response);
    const review =
      response.status.toUpperCase().includes("REVIEW")
        ? ` ${t("reviewRequired")}`
        : "";
    push({
      role: "assistant",
      kind: "success",
      text: `${t("successTitle")}. ${body}${review}`,
    });
  };

  const handleError = (error: unknown) => {
    const detail = error instanceof Error ? error.message : t("errorBody");
    push({
      role: "assistant",
      kind: "error",
      text: `${t("errorTitle")}: ${detail}`,
    });
  };

  const submitText = async (event: FormEvent) => {
    event.preventDefault();
    const text = draft.trim();
    if (text.length < 5) {
      push({ role: "assistant", kind: "error", text: t("tooShort") });
      return;
    }

    setBusy(true);
    push({ role: "user", text });
    setDraft("");
    try {
      const location = await getOptionalLocation();
      const response = await submitTextFeedback(
        text,
        location.latitude,
        location.longitude
      );
      handleResponse(response);
    } catch (error) {
      handleError(error);
    } finally {
      setBusy(false);
    }
  };

  const submitAudio = async (blob: Blob) => {
    setBusy(true);
    push({ role: "user", text: `🎤 ${t("submitRecording")}` });
    try {
      const location = await getOptionalLocation();
      const response = await submitAudioFeedback(
        blob,
        location.latitude,
        location.longitude
      );
      handleResponse(response);
    } catch (error) {
      handleError(error);
    } finally {
      setBusy(false);
    }
  };

  const welcomeText = `${t("welcomeTitle")}. ${t("welcomeBody")} ${t("locationHint")}`;

  return (
    <div className="flex min-h-full flex-1">
      <a
        href="#citizen-chat"
        className="sr-only focus:not-sr-only focus:absolute focus:left-3 focus:top-3 focus:z-50 focus:rounded-md focus:bg-primary focus:px-3 focus:py-2 focus:text-primary-foreground"
      >
        {t("skipToChat")}
      </a>

      {newsOpen ? (
        <button
          type="button"
          className="fixed inset-0 z-30 bg-black/40 md:hidden"
          aria-label={t("newsClose")}
          onClick={() => setNewsOpen(false)}
        />
      ) : null}

      <div className="mx-auto flex min-h-full w-full max-w-5xl flex-1">
        <section className="flex min-h-full min-w-0 flex-1 flex-col bg-background">
          <header className="flex items-center justify-between gap-2 border-b border-border px-3 py-3 sm:px-4">
            <div>
              <p className="text-sm font-semibold tracking-tight">{t("appName")}</p>
              <p className="text-xs text-muted-foreground">{t("appTagline")}</p>
            </div>
            <div className="flex items-center gap-2">
              <LanguageSelector />
              <Button
                type="button"
                variant="outline"
                size="icon"
                aria-expanded={newsOpen}
                aria-controls="news-panel"
                aria-label={t("newsToggle")}
                onClick={() => setNewsOpen((open) => !open)}
              >
                <Newspaper />
              </Button>
            </div>
          </header>

          <div
            id="citizen-chat"
            ref={listRef}
            role="log"
            aria-live="polite"
            aria-relevant="additions"
            aria-label={t("chatRegion")}
            className="flex-1 space-y-3 overflow-y-auto px-3 py-4 sm:px-4"
          >
            {messages.map((message) => {
              const text = message.id === "welcome" ? welcomeText : message.text;
              const isUser = message.role === "user";
              return (
                <article
                  key={message.id}
                  className={cn("flex", isUser ? "justify-end" : "justify-start")}
                >
                  <div
                    className={cn(
                      "max-w-[90%] rounded-2xl px-3 py-2 text-sm leading-relaxed sm:max-w-[80%]",
                      isUser && "bg-primary text-primary-foreground",
                      !isUser && message.kind === "error" && "bg-destructive/10 text-destructive",
                      !isUser && message.kind === "success" && "bg-accent text-accent-foreground",
                      !isUser && (message.kind === "info" || !message.kind) && "bg-muted text-foreground"
                    )}
                  >
                    <p className="mb-1 text-[10px] font-semibold uppercase tracking-wide opacity-70">
                      {isUser ? t("you") : t("assistant")}
                    </p>
                    <p>{text}</p>
                  </div>
                </article>
              );
            })}
          </div>

          <form
            onSubmit={submitText}
            className="border-t border-border bg-card px-3 py-3 sm:px-4"
          >
            <label htmlFor={inputId} className="mb-1 block text-xs font-medium">
              {t("composerLabel")}
            </label>
            <div className="flex items-end gap-2">
              <textarea
                id={inputId}
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                placeholder={t("composerPlaceholder")}
                disabled={busy}
                rows={2}
                aria-required="true"
                className="min-h-16 flex-1 resize-none rounded-xl border border-input bg-background px-3 py-2 text-sm outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring"
                onKeyDown={(event) => {
                  if (event.key === "Enter" && !event.shiftKey) {
                    event.preventDefault();
                    event.currentTarget.form?.requestSubmit();
                  }
                }}
              />
              <Button type="submit" size="icon" disabled={busy} aria-label={t("send")}>
                <Send />
              </Button>
            </div>
            <p className="sr-only" aria-live="polite">
              {busy ? t("sending") : t("statusLive")}
            </p>
            <div className="mt-3">
              <AudioRecorder disabled={busy} onSubmit={submitAudio} />
            </div>
          </form>
        </section>

        <NewsPanel open={newsOpen} onClose={() => setNewsOpen(false)} />
      </div>
    </div>
  );
}
