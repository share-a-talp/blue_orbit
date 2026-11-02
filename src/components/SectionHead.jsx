export default function SectionHead({ title, intro }) {
  return (
    <div className="bo-section__head">
      <h2 className="bo-section__title">{title}</h2>
      {intro && <p className="bo-section__intro">{intro}</p>}
    </div>
  )
}
