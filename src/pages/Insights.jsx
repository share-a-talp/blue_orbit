import { useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import SubHead from '../components/SubHead.jsx'
import Pagination from '../components/Pagination.jsx'
import ContactNote from '../components/ContactNote.jsx'
import { postCategories, posts } from '../lib/content.js'
import useTitle from '../lib/useTitle.js'

const PAGE_SIZE = 10

export default function Insights() {
  useTitle('인사이트')
  const [params, setParams] = useSearchParams()
  const [query, setQuery] = useState('')
  const category = params.get('category') || ''
  const page = Number(params.get('page')) || 1

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return posts.filter(
      (post) =>
        (!category || post.category === category) &&
        (!q || `${post.title} ${post.summary ?? ''}`.toLowerCase().includes(q)),
    )
  }, [category, query])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const current = Math.min(page, totalPages)
  const rows = filtered.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE)

  const update = (next) => {
    const merged = { category, page: String(current), ...next }
    setParams(Object.fromEntries(Object.entries(merged).filter(([, v]) => v && v !== '1')))
  }

  return (
    <>
      <SubHead title="인사이트" desc="블로그에 게시했던 글을 원 게시일 순으로 옮겨 둔 아카이브입니다." />
      <div className="bo-container bo-subbody">
        <div className="bo-board-toolbar">
          <div className="bo-tabs" role="tablist">
            {['', ...postCategories].map((cat) => (
              <button
                key={cat || 'all'}
                type="button"
                role="tab"
                aria-selected={cat === category}
                className={cat === category ? 'bo-tabs__btn is-active' : 'bo-tabs__btn'}
                onClick={() => update({ category: cat, page: '1' })}
              >
                {cat || '전체'}
              </button>
            ))}
          </div>
          <input
            type="search"
            className="bo-search"
            placeholder="제목·요약 검색"
            aria-label="글 검색"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value)
              update({ page: '1' })
            }}
          />
        </div>

        <table className="bo-board bo-board--list">
          <thead>
            <tr>
              <th scope="col">번호</th>
              <th scope="col">분류</th>
              <th scope="col">제목</th>
              <th scope="col">원 게시일</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((post, i) => (
              <tr key={post.slug}>
                <td className="bo-board__num">{filtered.length - ((current - 1) * PAGE_SIZE + i)}</td>
                <td><span className="bo-badge">{post.category}</span></td>
                <td className="bo-board__title">
                  <Link to={`/insights/${post.slug}`}>{post.title}</Link>
                  {post.summary && <span className="bo-board__summary">{post.summary}</span>}
                </td>
                <td className="bo-board__date">{post.originalPublishedAt}</td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={4} className="bo-board__empty">게시물이 없습니다.</td>
              </tr>
            )}
          </tbody>
        </table>

        <Pagination page={current} total={totalPages} onChange={(n) => update({ page: String(n) })} />
      </div>
      <ContactNote />
    </>
  )
}
