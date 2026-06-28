import { execSync } from "node:child_process";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import sharp from "sharp";

const ROOT = process.cwd();
const markSvg = readFileSync(join(ROOT, "public", "brand", "logo-mark.svg"), "utf8");

/** Maskable icon: extra padding so the badge is not clipped on Android. */
function maskableSvg(size) {
  const pad = Math.round(size * 0.12);
  const inner = size - pad * 2;
  return `
<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <rect width="${size}" height="${size}" fill="#064E3B"/>
  <svg x="${pad}" y="${pad}" width="${inner}" height="${inner}" viewBox="0 0 512 512">
    ${markSvg.replace(/<svg[^>]*>/, "").replace(/<\/svg>\s*$/, "")}
  </svg>
</svg>`;
}

async function writePng(svg, filePath, size) {
  await sharp(Buffer.from(svg)).resize(size, size).png().toFile(filePath);
}

const outDir = join(ROOT, "public", "icons");
const appDir = join(ROOT, "app");
const publicDir = join(ROOT, "public");
mkdirSync(outDir, { recursive: true });

await writePng(markSvg, join(outDir, "icon-192.png"), 192);
await writePng(markSvg, join(outDir, "icon-512.png"), 512);
await writePng(maskableSvg(512), join(outDir, "icon-512-maskable.png"), 512);

writeFileSync(
  join(outDir, "apple-touch-icon.png"),
  await sharp(join(outDir, "icon-192.png")).png().toBuffer(),
);

// Browser tab favicon (Next.js app/ file conventions)
await writePng(markSvg, join(appDir, "icon.png"), 32);
await writePng(markSvg, join(appDir, "apple-icon.png"), 180);

// Legacy /favicon.ico request + multi-size PNG fallbacks
const favicon16 = join(publicDir, "favicon-16.png");
const favicon32 = join(publicDir, "favicon-32.png");
await writePng(markSvg, favicon16, 16);
await writePng(markSvg, favicon32, 32);

try {
  execSync(
    `magick "${favicon16}" "${favicon32}" "${join(appDir, "favicon.ico")}"`,
    { stdio: "ignore" },
  );
  execSync(`cp "${join(appDir, "favicon.ico")}" "${join(publicDir, "favicon.ico")}"`, {
    stdio: "ignore",
  });
} catch {
  // ImageMagick unavailable — 32px PNG still works via metadata + app/icon.png
  writeFileSync(join(publicDir, "favicon.ico"), readFileSync(favicon32));
}

console.log("Generated RaahPass favicon + PWA icons");

const screenshotsDir = join(ROOT, "public", "screenshots");
mkdirSync(screenshotsDir, { recursive: true });

function screenshotSvg(width, height, { title, subtitle, cta }) {
  const headerH = Math.round(height * 0.08);
  const logoSize = Math.round(Math.min(width, height) * 0.14);
  const logoY = headerH + Math.round(height * 0.12);
  const titleSize = Math.round(width * 0.055);
  const subtitleSize = Math.round(width * 0.028);
  const ctaW = Math.round(width * 0.62);
  const ctaH = Math.round(height * 0.055);
  const ctaY = logoY + logoSize + Math.round(height * 0.22);

  return `
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <rect width="${width}" height="${height}" fill="#f8fafc"/>
  <rect width="${width}" height="${headerH}" fill="#064E3B"/>
  <svg x="${Math.round(width * 0.06)}" y="${Math.round(headerH * 0.22)}" width="${Math.round(headerH * 0.6)}" height="${Math.round(headerH * 0.6)}" viewBox="0 0 512 512">
    ${markSvg.replace(/<svg[^>]*>/, "").replace(/<\/svg>\s*$/, "")}
  </svg>
  <text x="${Math.round(width * 0.16)}" y="${Math.round(headerH * 0.62)}" fill="#ffffff" font-family="Arial, sans-serif" font-size="${Math.round(headerH * 0.38)}" font-weight="700">RaahPass</text>
  <svg x="${(width - logoSize) / 2}" y="${logoY}" width="${logoSize}" height="${logoSize}" viewBox="0 0 512 512">
    ${markSvg.replace(/<svg[^>]*>/, "").replace(/<\/svg>\s*$/, "")}
  </svg>
  <text x="${width / 2}" y="${logoY + logoSize + titleSize * 1.2}" fill="#0f172a" font-family="Arial, sans-serif" font-size="${titleSize}" font-weight="700" text-anchor="middle">${title}</text>
  <text x="${width / 2}" y="${logoY + logoSize + titleSize * 2.4}" fill="#64748b" font-family="Arial, sans-serif" font-size="${subtitleSize}" text-anchor="middle">${subtitle}</text>
  <rect x="${(width - ctaW) / 2}" y="${ctaY}" width="${ctaW}" height="${ctaH}" rx="${Math.round(ctaH / 2)}" fill="#064E3B"/>
  <text x="${width / 2}" y="${ctaY + ctaH * 0.68}" fill="#ffffff" font-family="Arial, sans-serif" font-size="${Math.round(subtitleSize * 1.05)}" font-weight="600" text-anchor="middle">${cta}</text>
  <text x="${width / 2}" y="${height - Math.round(height * 0.06)}" fill="#94a3b8" font-family="Arial, sans-serif" font-size="${Math.round(subtitleSize * 0.9)}" text-anchor="middle">247+ questions · 10 minutes · Free</text>
</svg>`;
}

async function writeScreenshot(filePath, width, height, copy) {
  const svg = screenshotSvg(width, height, copy);
  await sharp(Buffer.from(svg)).png().toFile(filePath);
}

await writeScreenshot(join(screenshotsDir, "mobile-home.png"), 1080, 1920, {
  title: "Your Road to a Driving Licence",
  subtitle: "Practice Pakistan traffic rules in English or Urdu",
  cta: "Start Practice Test",
});

await writeScreenshot(join(screenshotsDir, "desktop-home.png"), 1280, 720, {
  title: "Pass Your Driving Test",
  subtitle: "Bilingual mock exams — no account required",
  cta: "Start Practice Test",
});

console.log("Generated PWA store screenshots");
