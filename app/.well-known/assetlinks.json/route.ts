import { NextResponse } from "next/server";

/**
 * Digital Asset Links for Android TWA (full-screen, no browser bar).
 * Set ANDROID_TWA_SHA256 in Vercel after the first GitHub Actions APK build
 * (the workflow prints the SHA-256 fingerprint in its logs).
 */
export function GET() {
  const fingerprint = process.env.ANDROID_TWA_SHA256?.trim();

  if (!fingerprint) {
    return NextResponse.json([], {
      headers: { "Content-Type": "application/json" },
    });
  }

  return NextResponse.json(
    [
      {
        relation: ["delegate_permission/common.handle_all_urls"],
        target: {
          namespace: "android_app",
          package_name: "app.raahpass.twa",
          sha256_cert_fingerprints: [fingerprint],
        },
      },
    ],
    {
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "public, max-age=3600",
      },
    },
  );
}
