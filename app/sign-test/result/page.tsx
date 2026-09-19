import { SignTestResultClient } from "@/components/sign-test/SignTestResultClient";
import { resolveLanguage } from "@/lib/resolve-language";

type PageProps = {
  searchParams: Promise<{ lang?: string }>;
};

export default async function SignTestResultPage({ searchParams }: PageProps) {
  const lang = await resolveLanguage((await searchParams).lang);
  return <SignTestResultClient fallbackLang={lang} />;
}
