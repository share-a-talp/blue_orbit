// 브랜드 이미지 생성: npm run brand
// brand-src/ 원본에서 로고 엠블럼, 파비콘, OG 이미지, 9-패치 우주 배경을 만든다.
//
// 9-패치 배경: 기초배경(1376×768) 크기의 칸 3×3 캔버스, 지구는 왼쪽 가운데 칸 원래 위치.
//   · 은하수 없음: 원본에서 지구·궤도만 오려 별밭 위에 올린다
//   · 바탕: 원본 가장자리 색의 어두운 남색 + 절차적 별 + 옅은 성운
import { mkdirSync } from 'node:fs'
import sharp from 'sharp'

const SRC = 'brand-src'
const OUT = 'src/assets/brand'
mkdirSync(OUT, { recursive: true })

// 같은 결과가 나오도록 시드 고정 난수
function rng(seed) {
  return () => {
    seed |= 0
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

// ───────────── 로고 ─────────────
const LOGO = `${SRC}/logo-source.webp`
const EMBLEM = { left: 425, top: 130, width: 470, height: 470 } // 엠블럼(궤도+별) 영역

await sharp(LOGO).extract(EMBLEM).resize(256, 256).webp({ quality: 90 }).toFile(`${OUT}/logo-mark.webp`)
await sharp(LOGO).extract(EMBLEM).resize(32, 32).png().toFile('public/favicon-32.png')
await sharp(LOGO).extract(EMBLEM).resize(180, 180).png().toFile('public/apple-touch-icon.png')
await sharp(LOGO)
  .resize(1200, 630, { fit: 'contain', background: '#020b1d' })
  .png({ compressionLevel: 9 })
  .toFile('public/og.png')

// 별: 원본과 비슷한 밀도·크기·색
function starsSvg(w, h, count, seed, skip, sizeScale = 1) {
  const r = rng(seed)
  const colors = ['#ffffff', '#ffffff', '#ffffff', '#dfe8ff', '#cfdcff', '#fff3d9']
  let out = ''
  for (let i = 0; i < count; i++) {
    const x = r() * w
    const y = r() * h
    if (skip && skip(x, y)) continue
    const size = (0.35 + Math.pow(r(), 5) * 2.2) * sizeScale
    const op = (0.25 + r() * 0.75).toFixed(2)
    const c = colors[Math.floor(r() * colors.length)]
    if (size > 1.6) out += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${(size * 3).toFixed(1)}" fill="${c}" opacity="0.08"/>`
    out += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${size.toFixed(2)}" fill="${c}" opacity="${op}"/>`
  }
  return Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">${out}</svg>`)
}

// ───────────── 모바일 배경 ─────────────
// 세로 우주 캔버스(800×1600)에 모바일 원본의 지구 부분을 축소해 오른쪽 아래에 넣는다.
// 지구 조각의 네 가장자리는 넓게 페이드해 주변 별밭과 섞는다(사각형 경계가 보이지 않게).
{
  const MW = 800
  const MH = 1600
  const CROP = { left: 0, top: 296, width: 768, height: 854 } // 지구+궤도, 지구 중심 = 조각의 (384, 384)
  const SCALE = 0.75
  const GLOBE_AT = { x: 0.66 * MW, y: 0.7 * MH } // 화면에서 지구 중심 위치(오른쪽 아래)

  const cw = Math.round(CROP.width * SCALE)
  const ch = Math.round(CROP.height * SCALE)
  const feather = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${cw}" height="${ch}">
    <defs><filter id="b" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="28"/></filter></defs>
    <rect x="60" y="60" width="${cw - 120}" height="${ch - 120}" rx="80" fill="#fff" filter="url(#b)"/>
  </svg>`)
  const piece = await sharp(
    await sharp(`${SRC}/bg-mobile-source.webp`).extract(CROP).resize(cw, ch).ensureAlpha().png().toBuffer(),
  )
    .composite([{ input: feather, blend: 'dest-in' }])
    .png()
    .toBuffer()

  const left = Math.round(GLOBE_AT.x - 384 * SCALE)
  const top = Math.round(GLOBE_AT.y - 384 * SCALE)
  // 조각이 캔버스 밖으로 나가는 부분은 잘라서 넣는다
  const visW = Math.min(cw, MW - left)
  const visH = Math.min(ch, MH - top)
  const pieceFit = await sharp(piece).extract({ left: 0, top: 0, width: visW, height: visH }).toBuffer()

  const bgSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="${MW}" height="${MH}">
    <defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#02040a"/><stop offset="1" stop-color="#030915"/>
    </linearGradient></defs>
    <rect width="100%" height="100%" fill="url(#g)"/>
  </svg>`
  await sharp(Buffer.from(bgSvg))
    .composite([
      { input: starsSvg(MW, MH, 3200, 23, null, 0.55) }, // 축소된 원본의 별 크기에 맞춤
      { input: pieceFit, left, top },
    ])
    .webp({ quality: 80 })
    .toFile(`${OUT}/space-mobile.webp`)
}

// npm run brand -- quick : 로고·모바일만 만들고 오래 걸리는 9-패치 캔버스는 건너뜀
if (process.argv[2] === 'quick') {
  console.log('brand 이미지 생성 완료 (quick: 9-패치 캔버스 제외)')
  process.exit(0)
}

// ───────────── 9-패치 우주 배경 ─────────────
const BG = `${SRC}/bg-desktop-source.webp`
const { width: CW, height: CH } = await sharp(BG).metadata() // 칸 크기 = 원본 크기
const W = CW * 3
const H = CH * 3
const MID_Y = CH // 가운데 줄 시작 y

// 1) 바탕: 원본 가장자리 색 계열의 어두운 남색 + 옅은 성운
const rand = rng(20261102)
const nebula = Array.from({ length: 9 }, () => {
  const cx = rand() * W
  const cy = rand() * H
  const rx = 300 + rand() * 700
  const ry = 120 + rand() * 260
  const hue = ['#1b2b5a', '#2a1f4a', '#13324a'][Math.floor(rand() * 3)]
  return `<ellipse cx="${cx | 0}" cy="${cy | 0}" rx="${rx | 0}" ry="${ry | 0}" fill="${hue}" opacity="${(0.1 + rand() * 0.12).toFixed(2)}"/>`
}).join('')

// 바탕은 1/8 크기로 그려 흐림 처리 후 확대(큰 캔버스 흐림은 매우 느림)
const LOW = 8
const baseSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W / LOW}" height="${H / LOW}" viewBox="0 0 ${W} ${H}">
  <defs>
    <radialGradient id="g" cx="0.35" cy="0.5" r="0.8">
      <stop offset="0" stop-color="#070d1a"/>
      <stop offset="1" stop-color="#02040a"/>
    </radialGradient>
    <filter id="blur" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="120"/></filter>
  </defs>
  <rect width="100%" height="100%" fill="url(#g)"/>
  <g filter="url(#blur)">${nebula}</g>
</svg>`
const base = await sharp(Buffer.from(baseSvg)).resize(W, H).png().toBuffer()

// 2) 지구 오려내기: 원본에서 은하수를 빼고 지구·궤도·빛번짐만 남긴다
//    · 지구 원판(중심·반지름 고정)은 그대로
//    · 그 밖은 채도와 밝기가 높은 픽셀(파란 빛번짐, 금색 궤도, 초록 별)만 — 은하수는 채도가 낮아 빠진다
const GLOBE = { x: 691, y: 378, r: 168 } // 원본 기준 지구 원판
const KEEP_BOX = { x0: 415, y0: 175, x1: 950, y1: 575 } // 궤도까지 포함하는 영역
const { data: px, info } = await sharp(BG).removeAlpha().raw().toBuffer({ resolveWithObject: true })
const alpha = Buffer.alloc(info.width * info.height)
const clamp01 = (v) => Math.max(0, Math.min(1, v))
for (let y = 0; y < info.height; y++) {
  for (let x = 0; x < info.width; x++) {
    const i = y * info.width + x
    const r = px[i * 3], g = px[i * 3 + 1], b = px[i * 3 + 2]
    const d = Math.hypot(x - GLOBE.x, y - GLOBE.y)
    let a = d < GLOBE.r ? 1 : clamp01((GLOBE.r + 18 - d) / 18)
    if (x >= KEEP_BOX.x0 && x <= KEEP_BOX.x1 && y >= KEEP_BOX.y0 && y <= KEEP_BOX.y1) {
      const sat = Math.max(r, g, b) - Math.min(r, g, b)
      const lum = Math.max(r, g, b)
      a = Math.max(a, clamp01((sat - 45) / 45) * clamp01((lum - 70) / 60))
    }
    alpha[i] = Math.round(a * 255)
  }
}
const alphaSoft = await sharp(alpha, { raw: { width: info.width, height: info.height, channels: 1 } }).blur(1.2).extractChannel(0).raw().toBuffer() // blur는 3채널로 돌려주므로 1채널만
const globeCut = await sharp(px, { raw: { width: info.width, height: info.height, channels: 3 } })
  .joinChannel(alphaSoft, { raw: { width: info.width, height: info.height, channels: 1 } })
  .png()
  .toBuffer()

// 3) 합성: 바탕 + 별 + 왼쪽 가운데 칸에 지구
const canvas = await sharp(base)
  .composite([
    { input: starsSvg(W, H, 12000, 7) },
    { input: globeCut, left: 0, top: MID_Y },
  ])
  .png()
  .toBuffer()

await sharp(canvas).webp({ quality: 74 }).toFile(`${OUT}/space-9x@2x.webp`)
await sharp(canvas).resize(Math.round(W / 2)).webp({ quality: 78 }).toFile(`${OUT}/space-9x.webp`)

console.log(`brand 이미지 생성 완료 (9-패치 캔버스 ${W}×${H})`)
