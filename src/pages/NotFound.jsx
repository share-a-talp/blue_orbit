import { Link } from 'react-router-dom'
import SubHead from '../components/SubHead.jsx'
import useTitle from '../lib/useTitle.js'

export default function NotFound() {
  useTitle('페이지를 찾을 수 없음')
  return (
    <>
      <SubHead title="페이지를 찾을 수 없습니다" desc="주소가 바뀌었거나 삭제된 페이지입니다." />
      <div className="bo-container bo-subbody">
        <Link to="/" className="bo-btn bo-btn--outline">홈으로</Link>
      </div>
    </>
  )
}
