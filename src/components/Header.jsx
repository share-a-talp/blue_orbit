import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { site } from '../lib/content.js'
import LogoMark from './LogoMark.jsx'

const linkClass = (base) => ({ isActive }) => (isActive ? `${base} is-active` : base)

export default function Header() {
  const [open, setOpen] = useState(false)
  const { pathname } = useLocation()

  useEffect(() => setOpen(false), [pathname])

  useEffect(() => {
    document.body.classList.toggle('is-menu-open', open)
    if (!open) return
    const onKey = (e) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  return (
    <>
      <header className="gnb">
        <div className="bo-container gnb__inner">
          <Link to="/" className="gnb__logo" aria-label={`${site.name} 홈`}>
            <LogoMark className="gnb__logo-mark" />
            {site.name}
          </Link>

          <nav aria-label="주 메뉴">
            <ul className="gnb__list">
              {site.nav.map((item) => (
                <li key={item.to}>
                  <NavLink to={item.to} end={item.to === '/'} className={linkClass('gnb__link')}>
                    {item.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          <button
            type="button"
            className="gnb__toggle"
            aria-label="메뉴 열기"
            aria-expanded={open}
            aria-controls="mobile-drawer"
            onClick={() => setOpen(true)}
          >
            <span className="gnb__toggle-bar" />
          </button>
        </div>
      </header>

      <div className="drawer-dim" onClick={() => setOpen(false)} aria-hidden="true" />
      <aside id="mobile-drawer" className="drawer" aria-label="모바일 메뉴" aria-hidden={!open}>
        <button type="button" className="drawer__close" aria-label="메뉴 닫기" onClick={() => setOpen(false)}>
          ×
        </button>
        <ul className="drawer__list">
          {site.nav.map((item) => (
            <li key={item.to}>
              <NavLink to={item.to} end={item.to === '/'} className={linkClass('drawer__link')}>
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>
        <p className="drawer__foot">{site.footer.copyright}</p>
      </aside>
    </>
  )
}
