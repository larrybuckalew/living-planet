/**
 * One-off texture optimizer: converts the raw NASA imagery into
 * compact WebP assets and generates the social share image.
 * Source files stay untouched in public/textures (kept as archival masters).
 */
import sharp from 'sharp'
import { mkdirSync } from 'node:fs'
import path from 'node:path'

const SRC = path.resolve('public/textures')
const OUT = path.resolve('public/textures-opt')
mkdirSync(OUT, { recursive: true })

async function webp(file, width, quality) {
  const target = path.join(OUT, file.replace(/\.(jpg|png)$/, '.webp'))
  const info = await sharp(path.join(SRC, file)).resize({ width }).webp({ quality }).toFile(target)
  console.log(`${file} -> ${path.basename(target)} ${(info.size / 1024).toFixed(0)} KB`)
}

await webp('earth-blue-marble.jpg', 2048, 70)
await webp('earth-night.jpg', 2048, 68)
await webp('clouds.png', 2048, 60) // keeps alpha
await webp('earth-topology.png', 1024, 70)
await webp('earth-water.png', 1024, 70)

// 1200x630 social share card: cropped globe edge + title overlay
const ogSvg = Buffer.from(`
<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
  <rect width="1200" height="630" fill="#060d09"/>
  <defs>
    <radialGradient id="g" cx="78%" cy="45%" r="65%">
      <stop offset="0%" stop-color="#123024" stop-opacity="0.9"/>
      <stop offset="100%" stop-color="#060d09" stop-opacity="1"/>
    </radialGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#g)"/>
  <circle cx="936" cy="283" r="360" fill="none" stroke="#e0a458" stroke-opacity="0.35" stroke-width="1.5"/>
  <circle cx="936" cy="283" r="300" fill="#0d241a"/>
  <text x="80" y="300" font-family="Georgia, serif" font-size="84" fill="#e9efe6">Living Planet</text>
  <text x="82" y="360" font-family="Georgia, serif" font-size="34" font-style="italic" fill="#9fb4a6">See the Earth breathe</text>
  <text x="82" y="420" font-family="Georgia, serif" font-size="22" fill="#e0a458">A LIVING, SPINNING GLOBE OF OUR WORLD</text>
</svg>
`)

const ogInfo = await sharp(
  await sharp(path.join(SRC, 'earth-blue-marble.jpg'))
    .resize(1400, 900, { fit: 'cover', position: 'attention' })
    .blur(2)
    .modulate({ brightness: 0.55, saturation: 0.8 })
    .toBuffer(),
)
  .composite([
    { input: ogSvg, blend: 'over' },
  ])
  .jpeg({ quality: 80 })
  .toFile(path.join(OUT, 'og.jpg'))
console.log(`og.jpg ${(ogInfo.size / 1024).toFixed(0)} KB`)
