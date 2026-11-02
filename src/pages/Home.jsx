import { Link } from 'react-router-dom'
import Hero from '../components/Hero.jsx'
import SectionHead from '../components/SectionHead.jsx'
import ContactNote from '../components/ContactNote.jsx'
import { homePage, posts } from '../lib/content.js'
import useTitle from '../lib/useTitle.js'

export default function Home() {
  useTitle('')
  const { hero, about, areas } = homePage
  const recent = posts.slice(0, 3)

  return (
    <>
      <Hero {...hero} />

      <section className="bo-section">
        <div className="bo-container">
          <SectionHead title={about.title} intro={about.text} />
        </div>
      </section>

      <section className="bo-section bo-section--alt">
        <div className="bo-container">
          <SectionHead title={areas.title} intro={areas.intro} />
          <div className="bo-grid bo-grid--2">
            {areas.items.map((area) => (
              <Link key={area.to} to={area.to} className="bo-area">
                <span className="bo-area__en">{area.en}</span>
                <h3 className="bo-area__title">{area.title}</h3>
                <p className="bo-area__desc">{area.desc}</p>
                <span className="bo-area__tags">
                  {area.tags?.map((tag) => (
                    <span key={tag} className="bo-badge">{tag}</span>
                  ))}
                </span>
                <span className="bo-area__more">자세히 보기 →</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {recent.length > 0 && (
        <section className="bo-section">
          <div className="bo-container">
            <SectionHead title="최근 인사이트" />
            <div className="bo-grid bo-grid--3">
              {recent.map((post) => (
                <article key={post.slug} className="bo-card">
                  <span className="bo-badge">{post.category}</span>
                  <h3 className="bo-card__title u-mt-4">
                    <Link to={`/insights/${post.slug}`}>{post.title}</Link>
                  </h3>
                  <p className="bo-card__desc">{post.summary}</p>
                </article>
              ))}
            </div>
            <p className="u-mt-6">
              <Link to="/insights">인사이트 전체 보기 →</Link>
            </p>
          </div>
        </section>
      )}

      <ContactNote />
    </>
  )
}
