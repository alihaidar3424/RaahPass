import { cookies } from "next/headers";
import { LANG_COOKIE } from "@/lib/constants";
import { parseLanguage } from "@/lib/language";
import type { Language } from "@/lib/validations";

export { LANG_COOKIE };

export async function resolveLanguage(
  searchParam: string | string[] | undefined | null,
): Promise<Language> {
  const fromQuery = parseLanguage(searchParam);
  const raw = Array.isArray(searchParam) ? searchParam[0] : searchParam;
  if (raw === "en" || raw === "ur") {
    return fromQuery;
  }

  const cookieStore = await cookies();
  return parseLanguage(cookieStore.get(LANG_COOKIE)?.value);
}
