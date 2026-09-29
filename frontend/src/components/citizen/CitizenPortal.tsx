"use client";

import { FormEvent, useId, useRef, useState } from "react";
import { Newspaper, Send, LayoutDashboard } from "lucide-react";
import Link from "next/link";

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
        
    let extraData = "";
    if (response.location || response.urgency || (response.tags && response.tags.length > 0)) {
      extraData = `\n\n📌 Extracted Context:\n📍 Location: ${response.location || "Unspecified"}\n🚨 Urgency: ${response.urgency || "Standard"}\n🏷️ Tags: ${(response.tags || []).join(", ")}`;
    }

    push({
      role: "assistant",
      kind: "success",
      text: `${t("successTitle")}. ${body}${review}${extraData}`,
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
    <div className="flex min-h-full flex-1 bg-gradient-to-br from-slate-950 via-indigo-950 to-blue-950 text-slate-50">
      <a
        href="#citizen-chat"
        className="sr-only focus:not-sr-only focus:absolute focus:left-3 focus:top-3 focus:z-50 focus:rounded-md focus:bg-blue-600 focus:px-3 focus:py-2 focus:text-white"
      >
        {t("skipToChat")}
      </a>

      {newsOpen ? (
        <button
          type="button"
          className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm md:hidden transition-all duration-300"
          aria-label={t("newsClose")}
          onClick={() => setNewsOpen(false)}
        />
      ) : null}

      <div className="mx-auto flex min-h-full w-full max-w-5xl flex-1 relative px-0 sm:px-4 sm:py-4 md:py-8 transition-all">
        <section className="flex min-h-full min-w-0 flex-1 flex-col bg-slate-900/60 backdrop-blur-2xl border-0 sm:border sm:border-white/10 sm:shadow-2xl sm:shadow-blue-900/50 sm:rounded-3xl overflow-hidden relative z-10">
          <header className="flex items-center justify-between gap-2 px-5 py-4 border-b border-white/10 bg-black/20 backdrop-blur-xl">
            <div>
              <p className="text-xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-300 drop-shadow-md">
                {t("appName")}
              </p>
              <p className="text-xs font-medium text-indigo-200/70">{t("appTagline")}</p>
            </div>
            <div className="flex items-center gap-3">
              <LanguageSelector />
              <Link href="/dashboard">
                <Button variant="outline" size="icon" className="bg-white/5 border-white/10 text-indigo-100 hover:bg-white/10 hover:text-white transition-all shadow-[0_0_15px_rgba(59,130,246,0.1)]" aria-label="Dashboard">
                  <LayoutDashboard className="w-4 h-4" />
                </Button>
              </Link>
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="bg-white/5 border-white/10 text-indigo-100 hover:bg-white/10 hover:text-white transition-all"
                aria-expanded={newsOpen}
                aria-controls="news-panel"
                aria-label={t("newsToggle")}
                onClick={() => setNewsOpen((open) => !open)}
              >
                <Newspaper className="w-4 h-4" />
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
            className="flex-1 space-y-4 overflow-y-auto px-4 py-6 sm:px-6"
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
                      "max-w-[90%] rounded-3xl px-5 py-3.5 text-[15px] leading-relaxed sm:max-w-[80%] shadow-lg transition-transform duration-300 hover:-translate-y-1",
                      isUser && "bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-blue-500/25 rounded-tr-sm border border-blue-400/20",
                      !isUser && message.kind === "error" && "bg-red-500/10 text-red-200 border border-red-500/20 rounded-tl-sm backdrop-blur-md",
                      !isUser && message.kind === "success" && "bg-emerald-500/10 text-emerald-100 border border-emerald-500/20 rounded-tl-sm backdrop-blur-md",
                      !isUser && (message.kind === "info" || !message.kind) && "bg-white/10 text-slate-100 border border-white/10 rounded-tl-sm backdrop-blur-md"
                    )}
                  >
                    <p className={cn("mb-1 text-[11px] font-bold uppercase tracking-wider", isUser ? "text-blue-100/70" : "text-indigo-200/70")}>
                      {isUser ? t("you") : t("assistant")}
                    </p>
                    <p className="font-medium tracking-tight drop-shadow-sm whitespace-pre-wrap">{text}</p>
                  </div>
                </article>
              );
            })}
          </div>

          <form
            onSubmit={submitText}
            className="bg-black/20 backdrop-blur-xl px-4 py-4 sm:px-6 border-t border-white/10 relative z-20"
          >
            <div className="flex flex-col gap-3 max-w-4xl mx-auto">
              <label htmlFor={inputId} className="sr-only">
                {t("composerLabel")}
              </label>
              <div className="flex items-end gap-3 bg-white/5 border border-white/10 p-2 rounded-3xl focus-within:ring-2 focus-within:ring-blue-500/50 focus-within:border-blue-500/50 transition-all shadow-inner">
                <textarea
                  id={inputId}
                  value={draft}
                  onChange={(event) => setDraft(event.target.value)}
                  placeholder={t("composerPlaceholder")}
                  disabled={busy}
                  rows={1}
                  aria-required="true"
                  className="min-h-12 flex-1 resize-none bg-transparent px-4 py-3 text-sm text-slate-100 placeholder:text-slate-400/70 outline-none"
                  onKeyDown={(event) => {
                    if (event.key === "Enter" && !event.shiftKey) {
                      event.preventDefault();
                      event.currentTarget.form?.requestSubmit();
                    }
                  }}
                />
                <Button type="submit" size="icon" disabled={busy} className="rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-400 hover:to-indigo-400 text-white shadow-[0_0_20px_rgba(59,130,246,0.4)] h-12 w-12 shrink-0 transition-transform hover:scale-105">
                  <Send className="w-5 h-5 ml-1" />
                </Button>
              </div>
              <div className="flex items-center justify-between pl-2">
                <p className="text-xs font-medium text-slate-400/70" aria-live="polite">
                  {busy ? t("sending") : "Ready"}
                </p>
                <div className="scale-95 origin-right">
                  <AudioRecorder disabled={busy} onSubmit={submitAudio} />
                </div>
              </div>
            </div>
          </form>
        </section>

        <NewsPanel open={newsOpen} onClose={() => setNewsOpen(false)} />
      </div>
    </div>
  );
}
