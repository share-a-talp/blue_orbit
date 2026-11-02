import { Link } from 'react-router-dom'

export default function Hero({ eyebrow, title, lead, primary, compact = false }) {
  return (
    <section className={compact ? 'bo-hero bo-hero--compact' : 'bo-hero'}>
      <div className="bo-container">
        {eyebrow && <span className="bo-hero__eyebrow">{eyebrow}</span>}
        <h1 className="bo-hero__title">{title}</h1>
        {lead && <p className="bo-hero__lead">{lead}</p>}
        {primary && (
          <div className="bo-hero__actions">
            <Link to={primary.to} className="bo-btn bo-btn--primary">
              {primary.label}
            </Link>
          </div>
        )}
      </div>
    </section>
  )
}
