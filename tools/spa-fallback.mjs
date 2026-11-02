// GitHub Pages는 SPA 경로 새로고침 시 404.html을 내주므로 index.html을 복사해 둔다.
import { copyFileSync, existsSync } from 'node:fs'

const src = 'dist/index.html'
if (!existsSync(src)) {
  console.error('dist/index.html 이 없습니다. vite build 를 먼저 실행하세요.')
  process.exit(1)
}
copyFileSync(src, 'dist/404.html')
console.log('dist/404.html 생성 완료')
