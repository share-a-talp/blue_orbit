import { useState } from 'react'
import SubHead from '../components/SubHead.jsx'
import ContactNote from '../components/ContactNote.jsx'
import { history } from '../lib/content.js'
import useTitle from '../lib/useTitle.js'

const years = [...new Set(history.map((item) => item.year))]

export default function History() {
  useTitle('히스토리')
  const [year, setYear] = useState(null)
  const rows = year ? history.filter((item) => item.year === year) : history

  return (
    <>
      <SubHead title="히스토리" desc="지나온 프로젝트와 경력을 연도별로 정리했습니다." />
      <div className="bo-container bo-subbody">
        <div className="bo-board-toolbar">
          <div className="bo-tabs" role="tablist">
            {[null, ...years].map((y) => (
              <button
                key={y ?? 'all'}
                type="button"
                role="tab"
                aria-selected={y === year}
                className={y === year ? 'bo-tabs__btn is-active' : 'bo-tabs__btn'}
                onClick={() => setYear(y)}
              >
                {y ?? '전체'}
              </button>
            ))}
          </div>
        </div>

        <table className="bo-board bo-board--list">
          <thead>
            <tr>
              <th scope="col">기간</th>
              <th scope="col">소속 / 프로젝트</th>
              <th scope="col">역할</th>
              <th scope="col">요약</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((item, i) => (
              <tr key={`${item.year}-${i}`}>
                <td className="bo-board__date">{item.period}</td>
                <td className="bo-board__title"><strong>{item.org}</strong></td>
                <td>{item.role}</td>
                <td className="u-text-muted">{item.summary}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <ContactNote />
    </>
  )
}
