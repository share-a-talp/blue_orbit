// content/ 폴더의 YAML·Markdown을 빌드 시점에 읽어 온다. 문구 수정은 content/ 에서만 한다.
import { parse } from 'yaml'
import siteRaw from '../../content/site.yaml?raw'
import homeRaw from '../../content/pages/home.yaml?raw'
import marketRaw from '../../content/pages/market.yaml?raw'
import businessRaw from '../../content/pages/business.yaml?raw'
import historyRaw from '../../content/history.yaml?raw'
import ipNoticeRaw from '../../content/legal/ip-notice.md?raw'

const FRONT_MATTER = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/

export function parseMarkdown(raw) {
  const match = raw.match(FRONT_MATTER)
  if (!match) return { data: {}, body: raw }
  return { data: parse(match[1]) ?? {}, body: raw.slice(match[0].length) }
}

export const site = parse(siteRaw)
export const homePage = parse(homeRaw)
export const marketPage = parse(marketRaw)
export const businessPage = parse(businessRaw)

export const history = (parse(historyRaw)?.items ?? []).sort((a, b) => b.year - a.year)

// HTML 주석(편집 안내)은 화면에 보이지 않게 제거
export const ipNotice = parseMarkdown(ipNoticeRaw).body.replace(/<!--[\s\S]*?-->/g, '').trim()

const postFiles = import.meta.glob('../../content/insights/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
})

export const posts = Object.entries(postFiles)
  .map(([path, raw]) => {
    const { data, body } = parseMarkdown(raw)
    const fileSlug = path.split('/').pop().replace(/\.md$/, '')
    return { ...data, slug: data.slug || fileSlug, body }
  })
  .filter((post) => !post.draft)
  .sort((a, b) => String(b.originalPublishedAt).localeCompare(String(a.originalPublishedAt)))

export const postCategories = [...new Set(posts.map((post) => post.category).filter(Boolean))]

export function findPost(slug) {
  const index = posts.findIndex((post) => post.slug === slug)
  if (index < 0) return null
  // posts는 최신순 — 이전 글은 더 오래된 글
  return { post: posts[index], prev: posts[index + 1] ?? null, next: posts[index - 1] ?? null }
}
