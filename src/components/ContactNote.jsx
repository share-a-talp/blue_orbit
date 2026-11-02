import { Link } from 'react-router-dom'

// 페이지 하단의 조용한 문의 안내 — 크게 드러내지 않고 찾을 수만 있게
export default function ContactNote({ children = '협업이나 문의할 내용이 있으신가요?' }) {
  return (
    <div className="bo-container">
      <p className="bo-contact-note">
        {children}
        <Link to="/contact">문의 남기기 →</Link>
      </p>
    </div>
  )
}
