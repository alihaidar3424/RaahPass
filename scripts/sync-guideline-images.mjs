import { existsSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import sharp from "sharp";

const ROOT = process.cwd();
const SOURCE_DIR = join(ROOT, "reference", "traffic-police-docs", "itp-web", "signs");
const OUT_DIR = join(ROOT, "public", "guidelines", "itp-signs");

mkdirSync(OUT_DIR, { recursive: true });

const POSTER_COUNT = 23;

for (let i = 1; i <= POSTER_COUNT; i += 1) {
  const source = join(SOURCE_DIR, `${i}.jpg`);
  const target = join(OUT_DIR, `${i}.jpg`);

  if (!existsSync(source)) {
    console.warn(`Missing source image: ${source}`);
    continue;
  }

  await sharp(source)
    .jpeg({ quality: 82, mozjpeg: true })
    .resize({ width: 1200, withoutEnlargement: true })
    .toFile(target);
}

console.log(`Synced ${POSTER_COUNT} ITP sign posters to public/guidelines/itp-signs/`);
