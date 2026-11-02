export default function Pagination({ page, total, onChange }) {
  if (total <= 1) return null
  const pages = Array.from({ length: total }, (_, i) => i + 1)
  return (
    <nav className="bo-pagination" aria-label="페이지">
      <button type="button" className="bo-pagination__btn" disabled={page === 1} onClick={() => onChange(page - 1)} aria-label="이전 페이지">
        ‹
      </button>
      {pages.map((n) => (
        <button
          key={n}
          type="button"
          className={n === page ? 'bo-pagination__btn is-active' : 'bo-pagination__btn'}
          aria-current={n === page ? 'page' : undefined}
          onClick={() => onChange(n)}
        >
          {n}
        </button>
      ))}
      <button type="button" className="bo-pagination__btn" disabled={page === total} onClick={() => onChange(page + 1)} aria-label="다음 페이지">
        ›
      </button>
    </nav>
  )
}
