import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import sharp from "sharp";

async function createIcon(size, filePath) {
  const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <defs>
    <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0f172a"/>
      <stop offset="100%" stop-color="#2563eb"/>
    </linearGradient>
  </defs>
  <rect width="${size}" height="${size}" rx="${Math.round(size * 0.18)}" fill="url(#g)"/>
  <text x="50%" y="54%" dominant-baseline="middle" text-anchor="middle"
    fill="white" font-family="system-ui, sans-serif" font-size="${Math.round(size * 0.42)}" font-weight="800">D</text>
</svg>`;

  await sharp(Buffer.from(svg)).png().toFile(filePath);
}

const outDir = join(process.cwd(), "public", "icons");
mkdirSync(outDir, { recursive: true });

await createIcon(192, join(outDir, "icon-192.png"));
await createIcon(512, join(outDir, "icon-512.png"));
await createIcon(512, join(outDir, "icon-512-maskable.png"));

writeFileSync(
  join(outDir, "apple-touch-icon.png"),
  await sharp(join(outDir, "icon-192.png")).png().toBuffer(),
);

console.log("Generated PWA icons in public/icons/");
