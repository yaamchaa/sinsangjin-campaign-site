/**
 * Design: "The Architect of Trust" — Editorial Civic
 * Pledges — 11대 핵심 공약 (매거진 기사식 구성)
 */
const PLEDGES = [
  {
    no: "01",
    title: "추진 10조 기금 조성",
    subtitle: "재건축·재개발 신속 추진 10조 기금 조성",
    body: "물량제한 폐지, 통합심의로 주민 뜻대로 기간 단축. 세입자 이사비용・ 2차 금융비용 지원, 주민 부담은 덜고 가치는 더하겠습니다.",
    metric: "10조 기금",
    metricLabel: "세대 재건축",
    district: "성남시",
  },
  {
    no: "02",
    title: "다이아몬드형 첨단산업",
    subtitle: "다이아몬드형 첨단산업벨트 완성",
    body: "위례 포스코글로벌센터 & 현대차그룹AI허브센터 판교1,2,3테크노밸리센터  백현마이스단지 ・ 오리역4테크노밸리 ・ 정자동바이오헬스클러스터 ・ 야탑도시첨단산업단지 ・ 상대원 하이테크밸리 첨단화.",
    metric: "약 196조",
    metricLabel: "매출 전망",
    district: "성남시",
  },
  {
    no: "03",
    title: "연결되는 교통",
    subtitle: "순환철도·순환도로 구축",
    body: "동서남북 주요 지역을 더 편하게 오가게 해서 출퇴근 시간 단축, 환승 편의, 지역 연결성 강화를 위한 순환철도・ 성남 시내와 주요 거점을 잇는 철도망을 원형 순환 형태를 구축해 이동 시간을 줄이고, 순환도로・ 성남 안팎의 주요 도로를 연결해 차량 흐름을 분산하고, 특정 구간의 교통 정체를 완화하겠습니다.",
    metric: "30분",
    metricLabel: "통근권 완성",
    district: "전 지역",
  },
  {
    no: "04",
    title: "학자금 지원",
    subtitle: "청소년 학업 지원금 지급",
    body: "초중고대 입학축하금 20만원 지급. 고3 학업성취장려금 연간 100만원 지원.",
    metric: "실지급",
    metricLabel: "교육비 투자",
    district: "전 지역",
  },
  {
    no: "05",
    title: "베이비 펀드 조성",
    subtitle: "신생아부터 청년까지 종잣돈 기금 마련",
    body: "우리 아이 첫 자산 100만원 지원. 18세까지 성남시가 자산관리 후 이자 포함 투자성과금 지급.",
    metric: "전 세대",
    metricLabel: "체감 복지",
    district: "전 지역",
  },
  {
    no: "06",
    title: "상품 개발 지원",
    subtitle: "지역 상권별 대표 상품 개발 지원",
    body: "0개 상권, 50억 지원, 성남사랑상품권 3000억원 특별 발행. 소상공인 소득 향상, 지역 경제 활성화.",
    metric: "전 세대",
    metricLabel: "소상공인 복지",
    district: "전 지역",
  },
  {
    no: "07",
    title: "지역난방 공급",
    subtitle: "원도심 지역난방 전격 공급",
    body: "원도심 수정·중원구 전 지역, 상대원 열원부지 조성중. 노후한 원도심 주거환경을 개선해서 생활 편의와 주거 만족도를 높여 드리겠습니다.",
    metric: "전 세대",
    metricLabel: "체감 복지",
    district: "중원・수정",
  },
  {
    no: "08",
    title: "청정 하수도",
    subtitle: "원도심 지하 '청정하수도' 프로젝트",
    body: "노후 하수관로 전면 교체 (합류식 > 분류식). 악취 없는 성남, 안전한 지하 인프라 대혁신.",
    metric: "전 세대",
    metricLabel: "체감 복지",
    district: "중원・수정",
  },
  {
    no: "09",
    title: "세느강이 분당에",
    subtitle: "명품 탄천 업그레이드 조성",
    body: "탄천을 파리 센느강처럼 경관 명소화. 시민 여가 공간·시설 확충, 탄천다리 테마 조명 설치.",
    metric: "성남시민",
    metricLabel: "문화 복지",
    district: "분당구",
  },
  {
    no: "10",
    title: "헬시 성남",
    subtitle: "성남 시민 건강하게",
    body: "대상포진 65세이상에서 50세 이상으로, 남녀청소년 HPV접종 18~26세. 생애 말기 케어 ・ 마지막까지 내집에서 편안하게 24시간 원스톱 성남형 재택의료.",
    metric: "전 세대",
    metricLabel: "체감 복지",
    district: "전 지역",
  },
  {
    no: "11",
    title: "시민이 후보입니다",
    subtitle: "시민 여러분과 함께 만들어갈 성남의 내일",
    body: "신상진의 11번째 공약은 '시민이 후보'입니다. 시민의 목소리가 곧 저의 정책이 되고, 시민의 지혜가 곧 성남의 미래가 될 것이며 성남시장이 되고자 하는 단 하나의 이유는 성남 시민이 후보이기 때문입니다.",
    metric: "모두와",
    metricLabel: "함께 미래",
    district: "성남시민",
  },
];

export default function Pledges() {
  return (
    <div className="paper-texture">
      <section className="border-b border-ink/15">
        <div className="container pt-20 pb-16">
          <div className="chapter-label">Chapter · The Pledges</div>
          <h1 className="mt-6 text-[clamp(2.75rem,7vw,5.5rem)] leading-[1.02]" style={{ color: "var(--color-navy)" }}>
            열한 개의<br/>
            <span style={{ color: "var(--color-brick)" }}>약속</span>.
          </h1>
          <p className="mt-8 max-w-2xl text-[17px] leading-[1.8] text-foreground/80">
            신상진의 다음 4년은 11가지의 구체적인 약속으로 설계됐습니다.
            각 공약은 추상적 구호가 아닌, 측정 가능한 지표와 구체적인 실행 계획을 포함합니다.
          </p>
        </div>
      </section>

      <section>
        <div className="container py-8">
          {PLEDGES.map((p, i) => (
            <article
              key={p.no}
              className={`reveal grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 py-20 ${
                i < PLEDGES.length - 1 ? "border-b border-ink/20" : ""
              }`}
            >
              {/* Left: big number */}
              <div className="lg:col-span-3">
                <div className="font-editorial italic text-sm tracking-widest text-muted-foreground uppercase">
                  Pledge No.
                </div>
                <div
                  className="mt-2 text-[clamp(6rem,14vw,11rem)] font-black leading-[0.9] tabular-nums"
                  style={{ fontFamily: "var(--font-serif)", color: "var(--color-navy)" }}
                >
                  {p.no}
                </div>
                <div className="mt-6 inline-block px-3 py-1 text-xs font-semibold tracking-widest" style={{ background: "var(--color-paper-warm)", color: "var(--color-navy)", letterSpacing: "0.15em" }}>
                  {p.district.toUpperCase()}
                </div>
              </div>

              {/* Right: content */}
              <div className="lg:col-span-9">
                <h2 className="text-[clamp(2rem,4vw,3.25rem)]" style={{ color: "var(--color-navy)" }}>
                  {p.title}
                </h2>
                <div className="mt-3 font-editorial italic text-lg md:text-xl" style={{ color: "var(--color-brick)" }}>
                  {p.subtitle}
                </div>

                <div className="mt-10 grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-10">
                  <div className="md:col-span-8">
                    <p className="text-[17px] leading-[1.85] text-foreground/80">
                      {p.body}
                    </p>
                  </div>
                  <div className="md:col-span-4 md:pl-6 md:border-l border-ink/25">
                    <div className="font-editorial italic text-xs tracking-widest text-muted-foreground uppercase">
                      Key Metric
                    </div>
                    <div className="mt-3 text-5xl font-black tabular-nums" style={{ fontFamily: "var(--font-serif)", color: "var(--color-brick)" }}>
                      {p.metric}
                    </div>
                    <div className="mt-2 text-sm font-semibold">
                      {p.metricLabel}
                    </div>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="border-t border-ink/15" style={{ background: "var(--color-paper-warm)" }}>
        <div className="container py-24">
          <div className="max-w-3xl mx-auto text-center reveal">
            <div className="chapter-label">The Commitment</div>
            <p className="mt-6 pull-quote" style={{ color: "var(--color-ink)" }}>
              이 11개의 약속은 "제 임기의 계약서"입니다.
              시민이 <span style={{ color: "var(--color-brick)" }}>평가하고, 채점하고, 책임을 물을 수 있는</span> 계약이 되겠습니다.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
