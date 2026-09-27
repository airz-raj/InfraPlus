"use client";

import { useI18n } from "@/components/providers";
import { Button } from "@/components/ui/button";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const { t } = useI18n();

  return (
    <main className="flex min-h-full flex-1 flex-col items-center justify-center gap-3 px-6 text-center">
      <h1 className="text-xl font-semibold">{t("errorPageTitle")}</h1>
      <p className="max-w-md text-sm text-muted-foreground">{t("errorPageBody")}</p>
      <Button type="button" onClick={reset}>
        {t("retry")}
      </Button>
    </main>
  );
}
