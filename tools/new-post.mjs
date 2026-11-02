// 사용법: npm run new-post -- <원본파일(hwp 등)> <slug> [원게시일 YYYY-MM-DD] [원문URL]
// 원본 파일의 sha256을 계산해 frontmatter 틀이 채워진 md 파일을 만든다. 본문은 수동으로 붙여 넣는다.
import { createHash } from 'node:crypto'
import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { basename } from 'node:path'

const [source, slug, publishedAt = '', originalUrl = ''] = process.argv.slice(2)
if (!source || !slug) {
  console.error('사용법: npm run new-post -- <원본파일> <slug> [원게시일] [원문URL]')
  process.exit(1)
}
if (!existsSync(source)) {
  console.error(`원본 파일이 없습니다: ${source}`)
  process.exit(1)
}

const hash = createHash('sha256').update(readFileSync(source)).digest('hex')
const today = new Date().toISOString().slice(0, 10)
const date = publishedAt || today
const out = `content/insights/${date}-${slug}.md`
if (existsSync(out)) {
  console.error(`이미 있는 파일입니다: ${out}`)
  process.exit(1)
}

writeFileSync(out, `---
title: "[PH] 글 제목"
slug: "${slug}"
category: "[PH] 분류"
summary: "[PH] 목록에 보일 한 줄 요약"
originalUrl: "${originalUrl}"
originalPublishedAt: "${date}"
migratedAt: "${today}"
author: "[PH] 작성자"
sourceFile: "${basename(source)}"
sourceHash: "sha256:${hash}"
rights: "[PH] 권리 고지"
draft: true
---

[PH] 본문을 여기에 붙여 넣으세요. 공개할 때 draft: true 를 지웁니다.
`)
console.log(`생성: ${out}`)
