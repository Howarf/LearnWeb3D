# Learn Web 3D

React와 Vite 기반으로 Web 3D 예제와 미니 게임을 실험하는 프로젝트입니다. Three.js 생태계와 물리 엔진, 상태 관리, Supabase 연동 등을 함께 사용해 3D 인터랙션과 게임 로직을 학습·검증할 수 있도록 구성되어 있습니다.

gitHub Page: https://howarf.github.io/LearnWeb3D/

## 주요 기능 및 콘텐츠

### 시작 예제

- 기본 큐브
- UI 연동하기
- 여러 가지 컨트롤러
- HTML로 제어하기
- 캔버스 글자
- 스크롤
- GLTF 로드
- HTML annotations

### 물리 엔진 예제

- 기초물리1
- 트리거 이벤트
- 충돌 이벤트
- 동전 먹기
- 따라가는 카메라
- 주사위 굴리기

### 게임

- 간단한 공튀기기
- 요트 다이스
  - 주요 파일: [`src/component/YachtDice.jsx`](src/component/YachtDice.jsx), [`src/stores/useDiceGameStore.js`](src/stores/useDiceGameStore.js)
- BPM Survival
  - 주요 파일: [`src/component/BpmSurvival.jsx`](src/component/BpmSurvival.jsx), [`src/stores/useBpmSurvivalStore.js`](src/stores/useBpmSurvivalStore.js)

### 기타 동작

- 모바일 환경에서는 [`src/component/MobileNotice.jsx`](src/component/MobileNotice.jsx)를 통해 PC 환경 최적화 안내를 표시합니다.
- 메뉴는 [`src/component/menu.jsx`](src/component/menu.jsx)에서 시작 예제, 물리 엔진 예제, 게임 그룹으로 구성됩니다.
- 라우팅은 [`src/App.jsx`](src/App.jsx)의 `BrowserRouter`, `Routes`, `basename={import.meta.env.BASE_URL}` 설정을 사용합니다.

## 기술 스택

- React 19.1.1
- Vite
- Three.js
- React Three Fiber
- Drei
- Rapier
- Cannon
- Zustand
- Supabase
- React Router
- Leva
- Ecctrl
- gltfjsx
- tunnel-rat

## 프로젝트 구조

```text
learn3d/
├─ package.json
├─ vite.config.js
├─ eslint.config.js
├─ index.html
├─ public/
└─ src/
   ├─ main.jsx
   ├─ App.jsx
   ├─ supabaseClient.js
   ├─ component/
   ├─ stores/
   └─ css/
```

주요 역할은 다음과 같습니다.

| 경로 | 설명 |
| --- | --- |
| [`src/main.jsx`](src/main.jsx) | React 애플리케이션 진입점 |
| [`src/App.jsx`](src/App.jsx) | 라우터 및 페이지 구성 |
| [`src/component/`](src/component) | 3D 예제, 물리 예제, 게임 컴포넌트 |
| [`src/stores/`](src/stores) | Zustand 기반 게임 상태 관리 |
| [`src/css/`](src/css) | CSS Module 등 스타일 파일 |
| [`src/supabaseClient.js`](src/supabaseClient.js) | Supabase 클라이언트 설정 |
| [`public/`](public) | 정적 리소스 |

## 설치 및 실행 방법

### 의존성 설치

```bash
npm install
```

### 개발 서버 실행

```bash
npm run dev
```

기본 개발 서버 스크립트는 다음 명령을 실행합니다.

```bash
vite --port 5000
```

로컬 검증 시 다음 명령으로 실행을 확인했습니다.

```bash
npm run dev -- --host 127.0.0.1
```

검증된 접속 주소는 다음과 같습니다.

```text
http://127.0.0.1:5000/LearnWeb3D/
```