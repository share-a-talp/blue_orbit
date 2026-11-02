import Hero from '../components/Hero.jsx'
import SectionHead from '../components/SectionHead.jsx'
import ContactNote from '../components/ContactNote.jsx'
import useTitle from '../lib/useTitle.js'

// 사업영역 페이지(고객과 시장 / 사업과 분석) 공통 틀 — 내용은 content/pages/*.yaml
export default function ServiceArea({ page }) {
  useTitle(page.hero.title)
  const { hero, services, process } = page

  return (
    <>
      <Hero {...hero} compact />

      <section className="bo-section">
        <div className="bo-container">
          <SectionHead title={services.title} intro={services.intro} />
          <div className="bo-grid bo-grid--2">
            {services.items.map((item) => (
              <article key={item.code} className="bo-service">
                <span className="bo-service__code">{item.code}</span>
                <h3 className="bo-service__title">{item.title}</h3>
                <p className="bo-service__desc">{item.desc}</p>
                {item.points?.length > 0 && (
                  <ul className="bo-service__points">
                    {item.points.map((point) => (
                      <li key={point}>{point}</li>
                    ))}
                  </ul>
                )}
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bo-section bo-section--dark">
        <div className="bo-container">
          <SectionHead title={process.title} />
          <ol className="bo-steps">
            {process.steps.map((step) => (
              <li key={step.title} className="bo-steps__item">
                <h3 className="bo-card__title">{step.title}</h3>
                <p className="bo-section__intro">{step.desc}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <ContactNote />
    </>
  )
}
