import { Link, useParams } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import ContactNote from '../components/ContactNote.jsx'
import NotFound from './NotFound.jsx'
import { findPost, ipNotice } from '../lib/content.js'
import useTitle from '../lib/useTitle.js'

// 어드민이 기록한 /media/... 경로를 배포 경로(VITE_BASE) 기준으로 바꾼다
const withBase = (src = '') => (src.startsWith('/') ? import.meta.env.BASE_URL + src.slice(1) : src)
const markdownComponents = {
  img: ({ node, src, alt, ...props }) => <img src={withBase(src)} alt={alt ?? ''} loading="lazy" {...props} />,
}

export default function InsightDetail() {
  const { slug } = useParams()
  const found = findPost(slug)
  useTitle(found?.post.title ?? '')
  if (!found) return <NotFound />
  const { post, prev, next } = found

  return (
    <>
      <article className="bo-container bo-subbody">
        <header className="bo-article__head">
          <span className="bo-badge">{post.category}</span>
          <h1 className="bo-article__title">{post.title}</h1>
          <div className="bo-article__meta">
            <span>원 게시일 {post.originalPublishedAt}</span>
            {post.author && <span>{post.author}</span>}
          </div>
        </header>

        <div className="bo-prose">
          <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>{post.body}</ReactMarkdown>
        </div>

        <aside className="bo-rights" aria-label="원본 및 권리 정보">
          <h2 className="bo-rights__title">원본·권리 정보</h2>
          <dl>
            <dt>원문</dt>
            <dd>{post.originalUrl ? <a href={post.originalUrl} target="_blank" rel="noreferrer">{post.originalUrl}</a> : '-'}</dd>
            <dt>원 게시일</dt>
            <dd>{post.originalPublishedAt || '-'}</dd>
            <dt>이관일</dt>
            <dd>{post.migratedAt || '-'}</dd>
            <dt>원본 파일</dt>
            <dd>{post.sourceFile || '-'}</dd>
            <dt>원본 해시</dt>
            <dd>{post.sourceHash || '-'}</dd>
            <dt>권리 고지</dt>
            <dd>{post.rights || '-'}</dd>
          </dl>
          <p className="bo-rights__notice">{ipNotice}</p>
        </aside>

        <nav className="bo-article__nav" aria-label="이전·다음 글">
          {next ? <Link to={`/insights/${next.slug}`}><b>다음 글</b>{next.title}</Link> : <span><b>다음 글</b>없음</span>}
          {prev ? <Link to={`/insights/${prev.slug}`}><b>이전 글</b>{prev.title}</Link> : <span><b>이전 글</b>없음</span>}
        </nav>

        <p className="u-mt-6">
          <Link to="/insights" className="bo-btn bo-btn--outline">목록</Link>
        </p>
      </article>
      <ContactNote>이 글과 관련해 이야기 나누고 싶으신가요?</ContactNote>
    </>
  )
}
