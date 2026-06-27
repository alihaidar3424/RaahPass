import { LinkButton } from "@/components/ui/Button";
import { AppShell } from "@/components/layout/AppShell";
import { resolveLanguage } from "@/lib/resolve-language";
import { dirForLanguage, t } from "@/lib/translations";
import { withLang } from "@/lib/language";

export default async function NotFound() {
  const lang = await resolveLanguage(undefined);
  const rtl = dirForLanguage(lang) === "rtl";

  return (
    <AppShell lang={lang} rtl={rtl} nav="home" showBottomNav>
      <main className="mx-auto max-w-lg px-4 py-16 text-center">
        <p className="text-6xl font-black text-slate-200">404</p>
        <h1 className="mt-4 text-2xl font-bold text-slate-900">{t(lang, "pageNotFound")}</h1>
        <p className="mt-3 text-slate-600">{t(lang, "pageNotFoundHint")}</p>
        <LinkButton href={withLang("/", lang)} className="mt-8" fullWidth>
          {t(lang, "navHome")}
        </LinkButton>
      </main>
    </AppShell>
  );
}
