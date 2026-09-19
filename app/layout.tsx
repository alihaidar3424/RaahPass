import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { cookies } from "next/headers";
import { Inter, Noto_Nastaliq_Urdu } from "next/font/google";
import { BRAND } from "@/lib/brand";
import { LANG_COOKIE } from "@/lib/constants";
import { parseLanguage } from "@/lib/language";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import "./globals.css";

const appUrl =
  process.env.NEXT_PUBLIC_APP_URL ??
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "https://raah-pass.vercel.app");

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const notoNastaliq = Noto_Nastaliq_Urdu({
  subsets: ["arabic"],
  variable: "--font-urdu",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL(appUrl),
  title: `${BRAND.nameEn} — ${BRAND.taglineEn}`,
  description: BRAND.descriptionEn,
  applicationName: BRAND.nameEn,
  openGraph: {
    title: `${BRAND.nameEn} — ${BRAND.taglineEn}`,
    description: BRAND.descriptionEn,
    type: "website",
    images: [{ url: "/screenshots/desktop-home.png", width: 1280, height: 720 }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${BRAND.nameEn} — ${BRAND.taglineEn}`,
    description: BRAND.descriptionEn,
    images: ["/screenshots/desktop-home.png"],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: BRAND.nameEn,
  },
  formatDetection: {
    telephone: false,
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16.png", sizes: "16x16", type: "image/png" },
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
    ],
    apple: [{ url: "/icons/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
    shortcut: "/favicon.ico",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f8fafc" },
    { media: "(prefers-color-scheme: dark)", color: "#064E3B" },
  ],
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const lang = parseLanguage(cookieStore.get(LANG_COOKIE)?.value);

  return (
    <html
      lang={lang}
      suppressHydrationWarning
      data-scroll-behavior="smooth"
      className={`${inter.variable} ${notoNastaliq.variable} h-full`}
    >
      <body className="min-h-full bg-background font-sans text-foreground antialiased">
        {process.env.NODE_ENV === "production" ? (
          <Script id="sw-register" strategy="beforeInteractive">
            {`if("serviceWorker"in navigator){navigator.serviceWorker.register("/sw.js",{scope:"/"}).catch(function(){});}`}
          </Script>
        ) : null}
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
