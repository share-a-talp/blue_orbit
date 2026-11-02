// 문의 게시판 → 메일 전송 어댑터.
// VITE_CONTACT_ENDPOINT 가 있으면 폼 메일 서비스(Web3Forms/Formspree)로 POST,
// 없으면 방문자 메일 앱을 여는 mailto 로 대체한다. 전송 방식을 바꿀 때는 이 파일만 고친다.
import { site } from './content.js'

const ENDPOINT = import.meta.env.VITE_CONTACT_ENDPOINT
const ACCESS_KEY = import.meta.env.VITE_CONTACT_ACCESS_KEY

export const contactMode = ENDPOINT ? 'form' : 'mailto'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const PHONE_RE = /^[0-9+\-()\s]{8,20}$/

export const emptyInquiry = { company: '', name: '', email: '', phone: '', message: '', botcheck: '' }

export function validateInquiry(values) {
  const errors = {}
  if (!values.company.trim()) errors.company = '회사명을 입력해 주세요.'
  if (!values.name.trim()) errors.name = '이름을 입력해 주세요.'
  if (!values.email.trim() && !values.phone.trim()) {
    errors.contact = '이메일과 연락처 중 하나는 입력해 주세요.'
  }
  if (values.email.trim() && !EMAIL_RE.test(values.email.trim())) errors.email = '이메일 형식을 확인해 주세요.'
  if (values.phone.trim() && !PHONE_RE.test(values.phone.trim())) errors.phone = '연락처 형식을 확인해 주세요.'
  if (values.message.trim().length < 10) errors.message = '문의 내용을 10자 이상 입력해 주세요.'
  return errors
}

function composeBody(values) {
  return [
    `회사: ${values.company}`,
    `이름: ${values.name}`,
    `이메일: ${values.email || '-'}`,
    `연락처: ${values.phone || '-'}`,
    '',
    '문의 내용:',
    values.message,
  ].join('\n')
}

export async function sendInquiry(values) {
  // 스팸봇 함정 필드가 채워지면 조용히 성공 처리
  if (values.botcheck) return { ok: true, mode: contactMode }

  const subject = `[${site.name} 홈페이지 문의] ${values.company} / ${values.name}`

  if (!ENDPOINT) {
    const href = `mailto:${site.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(composeBody(values))}`
    window.location.href = href
    return { ok: true, mode: 'mailto' }
  }

  const payload = {
    subject,
    from_name: `${site.name} 홈페이지`,
    company: values.company,
    name: values.name,
    email: values.email,
    phone: values.phone,
    message: values.message,
  }
  if (ACCESS_KEY) payload.access_key = ACCESS_KEY
  if (values.email) payload.replyto = values.email

  const res = await fetch(ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify(payload),
  })
  if (!res.ok) throw new Error(`전송 실패 (${res.status})`)
  return { ok: true, mode: 'form' }
}
