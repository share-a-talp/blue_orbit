import { useState } from 'react'
import SubHead from '../components/SubHead.jsx'
import { contactMode, emptyInquiry, sendInquiry, validateInquiry } from '../lib/contact.js'
import useTitle from '../lib/useTitle.js'

export default function Contact() {
  useTitle('문의')
  const [values, setValues] = useState(emptyInquiry)
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState({ type: '', message: '' })
  const [sending, setSending] = useState(false)

  const set = (key) => (e) => setValues((v) => ({ ...v, [key]: e.target.value }))
  const invalid = (key) => (errors[key] ? 'is-invalid' : '')

  const onSubmit = async (e) => {
    e.preventDefault()
    const found = validateInquiry(values)
    setErrors(found)
    if (Object.keys(found).length) {
      setStatus({ type: 'error', message: '입력 내용을 확인해 주세요.' })
      return
    }
    setSending(true)
    setStatus({ type: '', message: '' })
    try {
      const result = await sendInquiry(values)
      setStatus({
        type: 'success',
        message:
          result.mode === 'mailto'
            ? '메일 앱이 열렸습니다. 내용 확인 후 보내기를 눌러 주세요.'
            : '문의가 접수되었습니다. 확인 후 연락드리겠습니다.',
      })
      if (result.mode === 'form') setValues(emptyInquiry)
    } catch {
      setStatus({ type: 'error', message: '전송에 실패했습니다. 잠시 후 다시 시도해 주세요.' })
    } finally {
      setSending(false)
    }
  }

  return (
    <>
      <SubHead title="문의" desc="남겨 주신 내용은 메일로 전달되며, 확인 후 회신드립니다." />
      <div className="bo-container bo-subbody">
        <form className="bo-form" onSubmit={onSubmit} noValidate>
          <table className="bo-form__table">
            <tbody>
              <tr>
                <th scope="row"><label htmlFor="f-company">회사<span className="bo-req">*</span></label></th>
                <td>
                  <input id="f-company" className={`bo-input ${invalid('company')}`} value={values.company} onChange={set('company')} autoComplete="organization" />
                  {errors.company && <p className="bo-form__error">{errors.company}</p>}
                </td>
              </tr>
              <tr>
                <th scope="row"><label htmlFor="f-name">이름<span className="bo-req">*</span></label></th>
                <td>
                  <input id="f-name" className={`bo-input ${invalid('name')}`} value={values.name} onChange={set('name')} autoComplete="name" />
                  {errors.name && <p className="bo-form__error">{errors.name}</p>}
                </td>
              </tr>
              <tr>
                <th scope="row">이메일 / 연락처<span className="bo-req">*</span></th>
                <td>
                  <div className="bo-form__pair">
                    <div>
                      <label htmlFor="f-email" className="u-sr-only">이메일</label>
                      <input id="f-email" type="email" placeholder="이메일" className={`bo-input ${invalid('email') || invalid('contact')}`} value={values.email} onChange={set('email')} autoComplete="email" />
                      {errors.email && <p className="bo-form__error">{errors.email}</p>}
                    </div>
                    <div>
                      <label htmlFor="f-phone" className="u-sr-only">연락처</label>
                      <input id="f-phone" type="tel" placeholder="연락처" className={`bo-input ${invalid('phone') || invalid('contact')}`} value={values.phone} onChange={set('phone')} autoComplete="tel" />
                      {errors.phone && <p className="bo-form__error">{errors.phone}</p>}
                    </div>
                  </div>
                  {errors.contact ? (
                    <p className="bo-form__error">{errors.contact}</p>
                  ) : (
                    <p className="bo-form__hint">둘 중 하나만 입력해도 됩니다.</p>
                  )}
                </td>
              </tr>
              <tr>
                <th scope="row"><label htmlFor="f-message">문의 내용<span className="bo-req">*</span></label></th>
                <td>
                  <textarea id="f-message" className={`bo-textarea ${invalid('message')}`} value={values.message} onChange={set('message')} />
                  {errors.message && <p className="bo-form__error">{errors.message}</p>}
                </td>
              </tr>
            </tbody>
          </table>

          {/* 스팸봇 함정 — 사람에게는 보이지 않음 */}
          <input type="text" className="u-hidden" tabIndex={-1} autoComplete="off" value={values.botcheck} onChange={set('botcheck')} aria-hidden="true" />

          <div className="bo-form__actions">
            <button type="submit" className="bo-btn bo-btn--primary" disabled={sending}>
              {sending ? '보내는 중…' : contactMode === 'mailto' ? '메일로 보내기' : '문의 보내기'}
            </button>
          </div>

          {status.message && (
            <p className={`bo-form__status is-${status.type}`} role="status">{status.message}</p>
          )}
        </form>
      </div>
    </>
  )
}
