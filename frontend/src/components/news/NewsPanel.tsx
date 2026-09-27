"use client";

import Image from "next/image";
import { X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useI18n } from "@/components/providers";
import { getLocalizedNews } from "@/lib/news";
import { cn } from "@/lib/utils";

type NewsPanelProps = {
  open: boolean;
  onClose: () => void;
};

export function NewsPanel({ open, onClose }: NewsPanelProps) {
  const { locale, t } = useI18n();
  const items = getLocalizedNews(locale);

  return (
    <aside
      id="news-panel"
      aria-label={t("newsTitle")}
      className={cn(
        "fixed inset-y-0 right-0 z-40 flex w-[min(100%,22rem)] flex-col border-l border-border bg-card shadow-xl transition-transform md:static md:z-0 md:h-full md:w-80 md:shrink-0 md:shadow-none",
        open ? "translate-x-0" : "translate-x-full md:hidden"
      )}
    >
      <div className="flex items-center justify-between gap-2 border-b border-border px-4 py-3">
        <h2 className="text-sm font-semibold">{t("newsTitle")}</h2>
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          aria-label={t("newsClose")}
          onClick={onClose}
        >
          <X />
        </Button>
      </div>
      <ul className="flex-1 space-y-3 overflow-y-auto p-4">
        {items.length === 0 ? (
          <li className="text-sm text-muted-foreground">{t("newsEmpty")}</li>
        ) : (
          items.map((item) => (
            <li key={item.id} className="overflow-hidden rounded-xl border border-border bg-background">
              <div className="relative h-28 w-full">
                <Image
                  src={item.imageUrl}
                  alt={item.imageAlt}
                  fill
                  className="object-cover"
                  sizes="320px"
                />
              </div>
              <div className="space-y-1 p-3">
                <p className="text-xs text-muted-foreground">
                  {item.source} · {item.publishedAt}
                </p>
                <h3 className="text-sm font-medium leading-snug">{item.title}</h3>
                <p className="text-xs leading-relaxed text-muted-foreground">
                  {item.summary}
                </p>
              </div>
            </li>
          ))
        )}
      </ul>
    </aside>
  );
}
