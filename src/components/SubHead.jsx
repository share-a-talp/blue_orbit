export default function SubHead({ title, desc }) {
  return (
    <div className="bo-subhead">
      <div className="bo-container">
        <h1 className="bo-subhead__title">{title}</h1>
        {desc && <p className="bo-subhead__desc">{desc}</p>}
      </div>
    </div>
  )
}
