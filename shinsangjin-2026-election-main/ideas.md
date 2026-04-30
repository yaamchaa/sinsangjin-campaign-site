# 신상진 2026 선거 홈페이지 디자인 브레인스토밍

## 선택된 컨셉: "신뢰의 건축가 (The Architect of Trust)" — Editorial Civic Design

### Design Movement
뉴욕타임스(NYT) 매거진의 에디토리얼 디자인 × 스위스 모더니즘(Swiss Design) × 한국 관공서의 신뢰감 있는 무게감을 결합한 **"Civic Editorial Style"**. 정치인 홈페이지가 흔히 빠지는 '화려한 선전물' 느낌을 탈피하고, 마치 권위 있는 시사 매거진이나 도시 계획 연보를 읽는 듯한 **지적이고 차분한 신뢰감**을 구축한다.

### Core Principles
1. **절제된 위엄 (Dignified Restraint)** — 과장된 슬로건 대신 데이터와 팩트가 말하게 한다.
2. **서사적 구조 (Narrative Structure)** — 각 섹션이 하나의 장(chapter)처럼 읽히도록 구성.
3. **타이포그래피 중심 (Typography-First)** — 사진보다 글자의 리듬으로 감정을 전달.
4. **시민 중심 시선 (Citizen-Centric Gaze)** — 후보 개인 찬양이 아닌, 성남이라는 도시와 시민의 이야기가 주인공.

### Color Philosophy
- **Primary: Deep Seongnam Navy (#0F2A47)** — 성남시의 공식 상징색에서 영감. 신뢰, 안정, 행정의 권위.
- **Accent: Warm Brick (#B84A2E)** — 원도심의 붉은 벽돌, 재개발의 열기를 상징. 너무 화려하지 않은 절제된 열정.
- **Neutral: Paper Cream (#F5F1E8)** — 오래된 시사지의 종이 질감. 디지털 피로도를 낮추고 읽기 편안함.
- **Ink: Charcoal (#1A1A1A)** — 본문 텍스트. 순수 검정 대신 먹색으로 부드럽게.
- **Muted Gold (#A8854C)** — 공약 달성 성과, 숫자 강조 포인트.

### Layout Paradigm
**매거진식 비대칭 그리드(Asymmetric Editorial Grid)**. 중앙 정렬된 히어로 대신, 좌측에 큰 헤드라인 타이포그래피 + 우측에 후보 초상화라는 클래식 매거진 커버 구도. 본문은 12칼럼 그리드에서 7:5, 4:8 비율로 변화를 주어 스크롤의 리듬감 창출. 각 섹션은 "Chapter 01. 성과", "Chapter 02. 약속" 같은 장 번호로 구조화.

### Signature Elements
1. **Chapter Divider** — 각 섹션 시작부에 얇은 가로선 + "CHAPTER 01 / ACHIEVEMENT" 같은 작은 영문 캡션.
2. **Pull Quote Blocks** — 시장의 주요 발언을 큰 세리프 폰트로 발췌 인용 (신문 칼럼 스타일).
3. **Data Margins** — 본문 좌측 여백에 핵심 수치(96.1%, 913,009명 등)를 작은 캡션으로 배치.

### Interaction Philosophy
과시적 애니메이션 배제. 스크롤 시 텍스트가 **신문 인쇄처럼 한 줄씩 부드럽게 페이드인**되고, 호버 시 미세한 밑줄 애니메이션만. 버튼 클릭 시 페이지 전환은 잉크가 번지듯 fade.

### Animation
- **Entrance**: 섹션 진입 시 IntersectionObserver로 `opacity 0→1, translateY 20px→0`, duration 800ms, ease-out.
- **Scroll Indicator**: 상단에 얇은 진행도 바 (Deep Navy → Warm Brick 그라데이션).
- **Number Counter**: 성과 지표 숫자는 뷰포트 진입 시 0부터 카운트업.
- **Hover**: 링크는 밑줄이 좌→우로 그어지는 애니메이션. 카드는 subtle lift (translateY -2px + shadow).
- **Parallax**: 히어로 이미지에 미세한 패럴랙스 (scroll * 0.3).

### Typography System
- **Display/Headline**: `Noto Serif KR` (900 weight) — 한글 세리프의 묵직한 권위감. 신문 헤드라인 느낌.
- **English Caption**: `Cormorant Garamond` (Italic) — "CHAPTER 01" 같은 영문 라벨용, 클래식 에디토리얼.
- **Body**: `Pretendard` (400/500) — 한국어 가독성 최상의 산세리프.
- **Numbers/Data**: `Pretendard` (700, tabular-nums) — 통계 수치 강조.
- **Hierarchy Rules**: H1 72px / H2 48px / H3 28px / Body 17px / Caption 13px uppercase tracking-widest.

### 왜 이 컨셉인가?
신상진 시장님의 핵심 메시지는 "공약 이행률 96.1%, 재정자립도 전국 1위"라는 **검증된 성과와 신뢰**입니다. 화려한 SNS 감성이나 젊은 후보식 네온 컬러는 오히려 이 메시지와 상충됩니다. 대신 시사 매거진 같은 에디토리얼 스타일은:
- 분당구 중산층 40-50대의 지적 안목에 부합
- "일하는 시장, 숫자로 증명하는 시장" 브랜드 강화
- 정치 혐오감을 일으키는 기존 선거 홈페이지 클리셰 탈피
- 시민과의 소통을 '선동'이 아닌 '대화'로 재정의
