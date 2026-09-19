import { redirect } from "next/navigation";
import { withLang } from "@/lib/language";
import { resolveLanguage } from "@/lib/resolve-language";

type PageProps = {
  searchParams: Promise<{ lang?: string }>;
};

/** Blog IA alias → guidelines (learn content). */
export default async function BlogRedirectPage({ searchParams }: PageProps) {
  const lang = await resolveLanguage((await searchParams).lang);
  redirect(withLang("/guidelines", lang));
}
