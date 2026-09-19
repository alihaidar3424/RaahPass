import { SignTestReviewClient } from "@/components/sign-test/SignTestReviewClient";
import { resolveLanguage } from "@/lib/resolve-language";

type PageProps = {
  searchParams: Promise<{ lang?: string }>;
};

export default async function SignTestReviewPage({ searchParams }: PageProps) {
  const lang = await resolveLanguage((await searchParams).lang);
  return <SignTestReviewClient fallbackLang={lang} />;
}
