import { WifiOff } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { LinkButton } from "@/components/ui/Button";
import { resolveLanguage } from "@/lib/resolve-language";
import { dirForLanguage, t } from "@/lib/translations";

type OfflinePageProps = {
  searchParams: Promise<{ lang?: string }>;
};

export default async function OfflinePage({ searchParams }: OfflinePageProps) {
  const params = await searchParams;
  const lang = await resolveLanguage(params.lang);
  const rtl = dirForLanguage(lang) === "rtl";

  return (
    <AppShell lang={lang} rtl={rtl} nav="home" showBottomNav>
      <main className="mx-auto flex max-w-lg flex-col items-center px-4 py-16 text-center">
        <WifiOff className="mb-4 h-12 w-12 text-slate-400" />
        <h1 className="text-2xl font-bold text-slate-900">{t(lang, "offlineTitle")}</h1>
        <p className="mt-3 max-w-sm text-slate-600">{t(lang, "offlineMessage")}</p>
        <LinkButton href={`/?lang=${lang}`} className="mt-8" variant="secondary">
          {t(lang, "navHome")}
        </LinkButton>
      </main>
    </AppShell>
  );
}
