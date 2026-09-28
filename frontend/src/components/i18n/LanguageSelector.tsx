"use client";

import { LOCALES, LOCALE_LABELS, type Locale } from "@/lib/i18n";
import { useI18n } from "@/components/providers";
import { cn } from "@/lib/utils";

export function LanguageSelector() {
  const { locale, setLocale, t } = useI18n();

  return (
    <div
      role="group"
      aria-label={t("languageSelector")}
      className="flex rounded-full border border-border bg-card p-0.5"
    >
      {LOCALES.map((code: Locale) => (
        <button
          key={code}
          type="button"
          aria-pressed={locale === code}
          onClick={() => setLocale(code)}
          className={cn(
            "min-h-8 rounded-full px-2.5 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
            locale === code
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          {LOCALE_LABELS[code]}
        </button>
      ))}
    </div>
  );
}
