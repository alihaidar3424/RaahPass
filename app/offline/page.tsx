import { WifiOff } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { LinkButton } from "@/components/ui/Button";
import { PageContainer } from "@/components/ui/PageContainer";
import { mutedTextClassName } from "@/components/ui/Card";
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
      <PageContainer withBottomNav className="flex flex-col items-center py-16 text-center">
        <WifiOff className="mb-4 h-12 w-12 text-muted-foreground" />
        <h1 className="text-2xl font-bold text-foreground">{t(lang, "offlineTitle")}</h1>
        <p className={mutedTextClassName("mt-3 max-w-sm")}>{t(lang, "offlineMessage")}</p>
        <LinkButton href={`/?lang=${lang}`} className="mt-8" fullWidth variant="secondary">
          {t(lang, "navHome")}
        </LinkButton>
      </PageContainer>
    </AppShell>
  );
}
