# 블루오빗 홈페이지

React + Vite 정적 사이트. GitHub Pages로 배포한다.

## 실행

```bash
npm install
npm run dev        # 개발 서버
npm run build      # dist/ 생성 (+ SPA용 404.html)
npm run preview    # 빌드 결과 확인
```

## 페이지

| 경로 | 구분 | 내용 파일 |
|---|---|---|
| `/` | 홈 · 회사 소개 | `content/pages/home.yaml` |
| `/market` | 주요(사업영역 1) · 정보전달형 — 고객과 시장 | `content/pages/market.yaml` (PoC / PMF 등) |
| `/business` | 주요(사업영역 2) · 정보전달형 — 사업과 분석 | `content/pages/business.yaml` (BM / RM 컨설팅) |
| `/insights` | 서브 · 게시판형 | `content/insights/*.md` |
| `/history` | 서브 · 게시판형 | `content/history.yaml` |
| `/contact` | 서브 · 게시판형(글쓰기) | 전송: `src/lib/contact.js` |

## 플레이스홀더

`[PH]` 로 표시된 문구는 모두 임시 값이다. 남은 항목은 아래로 찾는다.

```bash
git grep -n "\[PH\]"
```

- 사이트 공통(회사 소개, 수신 메일, 푸터 권리 문구): `content/site.yaml`
- 지식재산권·권리 고지: `content/legal/ip-notice.md` — 추가 자료 받은 뒤 확정

## 관리자(입력) 화면 — Sveltia CMS

오픈소스 [Sveltia CMS](https://github.com/sveltia/sveltia-cms)(MIT, Decap CMS 호환)를 `public/admin/`에 붙였다.
서버나 DB 없이 `content/` 폴더의 YAML·MD 파일을 폼으로 고쳐 저장한다. 설정은 `public/admin/config.yml`.

| 메뉴 | 편집 대상 |
|---|---|
| 인사이트 (블로그) | `content/insights/*.md` — 글 작성, 이미지 업로드(`public/media/`), 원본·권리 정보 |
| 페이지 문구 | 홈, 사업영역 2개(고객과 시장 / 사업과 분석), 사이트 공통(회사명·메일·푸터) |
| 히스토리 | `content/history.yaml` |
| 권리 고지 | `content/legal/ip-notice.md` |

**로컬에서 쓰기 (지금 단계)** — Chrome 또는 Edge 필요

1. `npm run dev`
2. `http://localhost:5173/admin/index.html` 접속 → **Work with Local Repository** → 이 프로젝트 폴더 선택
3. 편집·저장하면 로컬 파일이 바로 바뀐다. 사이트(`http://localhost:5173/`)에서 확인 후 직접 커밋.

**GitHub 연결 후** — `config.yml`의 `repo`를 실제 저장소로 바꾸면 배포된 사이트의 `/admin/index.html`에서
**Sign In with Token**(GitHub 토큰, Contents 읽기·쓰기 권한)으로 로그인해 바로 커밋할 수 있다.
비개발자 여러 명이 쓸 때는 Sveltia CMS Authenticator(Cloudflare Workers)로 GitHub 로그인을 붙인다.

주의
- 관리자에서 저장하면 YAML의 주석이 사라지고 줄 정렬이 바뀔 수 있다.
- 공개 보류(초안) 스위치가 켜진 글은 사이트에 보이지 않는다.
- Sveltia CMS는 아직 베타(0.x)라서 버전을 `0.246.1`로 고정했다. 올릴 때는 `admin/index.html`의 버전을 바꾸고 확인한다.

## 인사이트 글 추가 (hwp → md)

```bash
npm run new-post -- "원본.hwp" my-slug 2021-03-14 https://blog.naver.com/...
```

원본 파일의 sha256이 `sourceHash`에 기록된 md 틀이 `content/insights/`에 `draft: true`로 생성된다.
본문을 붙여 넣고 `draft: true`를 지우면 공개된다. 이미지는 `public/insights/<slug>/`에 둔다.

## 문의 → 메일

`.env.example`을 `.env`로 복사해 설정한다.

- `VITE_CONTACT_ENDPOINT` 비움: mailto 방식(방문자 메일 앱이 열림, 수신 주소는 `site.yaml`의 `email`)
- Web3Forms / Formspree 주소 지정: 사이트 안에서 바로 전송되어 메일로 도착

배포 시에는 GitHub 저장소 Settings → Variables `CONTACT_ENDPOINT`, Secrets `CONTACT_ACCESS_KEY`에 넣는다.

## 브랜드 이미지

원본은 `brand-src/`(로고, 기초배경, 모바일 배경). `npm run brand`로 다시 만든다(약 3분).

- `src/assets/brand/logo-mark.webp` — 로고에서 잘라낸 엠블럼(헤더)
- `public/favicon-32.png`, `apple-touch-icon.png`, `og.png`
- `src/assets/brand/space-9x(@2x).webp` — 9-패치 우주 배경. 기초배경을 3×3 캔버스의 왼쪽 가운데 칸에 두고
  나머지 8칸을 우주 공간으로 채운 것(은하수 없음 — 원본에서 지구·궤도만 오려 절차적 별밭 위에 올림).
  홈·사업영역 페이지 상단에 `cover`로 깔리므로 화면 비율과 관계없이 지구는 왼쪽 가운데에 위치한다.
- `src/assets/brand/space-mobile.webp` — 768px 이하 화면 배경(세로 별밭, 지구는 오른쪽 아래에 작게)
- `npm run brand -- quick` — 로고·모바일만 다시 만든다(9-패치 캔버스 제외, 빠름)

## 스타일

일반 CSS 파일만 쓴다(CSS Modules·인라인 스타일 없음). 진입점은 `src/styles/index.css`.

- `src/styles/global/` — 전체 스타일 (`tokens` · `reset` · `base` · `layout` · `components` · `utilities`)
- `src/styles/menu/` — 메뉴 스타일 (`menu-tokens` · `gnb` · `mobile-drawer` · `footer-nav`)

규칙
1. 색·간격 값은 `global/tokens.css` 변수만 쓴다. 메뉴 변수도 global 토큰을 참조한다.
2. global 파일은 메뉴 선택자를, menu 파일은 메뉴 밖 요소를 건드리지 않는다.
3. 접두어: 전체 `.bo-`, 메뉴 `.gnb-` `.drawer-` `.fnav-` / 이름은 BEM / 상태는 `.is-*`.
4. 우선순위는 `@layer`로 고정한다. `!important` 금지.
5. 브레이크포인트: 1024 / 768 / 480.

## 배포

`.github/workflows/deploy.yml` — `main`에 push하면 빌드·배포된다.
저장소 Settings → Pages → Source를 **GitHub Actions**로 설정한다.
커스텀 도메인을 쓰면 워크플로의 `VITE_BASE`를 `/`로 바꾸고 `public/CNAME`을 추가한다.
