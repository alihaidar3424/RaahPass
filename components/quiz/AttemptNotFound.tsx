import { AppShell } from "@/components/layout/AppShell";
import { LinkButton } from "@/components/ui/Button";
import { PageContainer } from "@/components/ui/PageContainer";
import { mutedTextClassName } from "@/components/ui/Card";
import { withLang } from "@/lib/language";
import { dirForLanguage, t } from "@/lib/translations";
import type { Language } from "@/lib/validations";

type AttemptNotFoundProps = {
  lang: Language;
};

export function AttemptNotFound({ lang }: AttemptNotFoundProps) {
  const rtl = dirForLanguage(lang) === "rtl";

  return (
    <AppShell lang={lang} rtl={rtl} nav="home" showBottomNav>
      <PageContainer withBottomNav className="py-16 text-center">
        <h1 className="text-2xl font-bold text-foreground">{t(lang, "errorNotFound")}</h1>
        <p className={mutedTextClassName("mt-3")}>{t(lang, "attemptNotFoundHint")}</p>
        <div className="mt-8 flex flex-col gap-3">
          <LinkButton href={withLang("/start", lang)} fullWidth>
            {t(lang, "newTest")}
          </LinkButton>
          <LinkButton href={withLang("/", lang)} variant="secondary" fullWidth>
            {t(lang, "navHome")}
          </LinkButton>
        </div>
      </PageContainer>
    </AppShell>
  );
}
