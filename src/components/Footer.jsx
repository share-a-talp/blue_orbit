import { Link } from 'react-router-dom'
import { site } from '../lib/content.js'

export default function Footer() {
  return (
    <footer className="bo-footer">
      <div className="bo-container bo-footer__inner">
        <div className="bo-footer__meta">
          <span className="bo-footer__brand">{site.name}</span>
          <span>{site.footer.copyright}</span>
          <span className="bo-footer__rights">{site.footer.rightsLine}</span>
        </div>
        <nav aria-label="푸터 메뉴" className="fnav">
          {site.nav.map((item) => (
            <Link key={item.to} to={item.to} className="fnav__link">
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  )
}
