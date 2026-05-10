/**
 * Design: "The Architect of Trust" — Editorial Civic
 * Achievements — 민선 8기 성과 연보
 */
const ACHIEVEMENTS = [
  {
    category: "재정·행정",
    items: [
      { metric: "전국 1위", label: "재정자립도", body: "경기도 31개 시·군 중 재정자립도 최상위권 유지. 대장동 부당이득 환수 추진(총 5,669억 원 규모 가압류․가처분 인용)." },
      { metric: "97.4%", label: "공약 이행률", body: "민선 8기 총 148개 공약 중 134개 완료 또는 정상 추진. 전국 광역·기초단체 중 최고 수준." },
      { metric: "Zero", label: "채무 제로 도시 달성", body: "(2026. 1. 최종) 당초 계획보다 3년 앞당겨 지방채 1,120억 원 상환, 채무 제로 달성." },
    ],
  },
  {
    category: "도시 정비",
    items: [
      { metric: "4개 단지", label: "분당 재건축 선도지구 지정", body: "시범단지 23·S6, 샘별마을 31·S4, 목련마을 6·S3, 양지마을 32구역의 특별정비구역 지정 확정. 2만여 세대 재건축의 돌파구." },
      { metric: "26개 구역", label: "수정·중원 재개발 본격화", body: "수진1·태평3·산성·단대·상대원2·3 26개 구역 정비계획 수립, 2026년 추가 정비구역 지정 목표로 추진." },
      { metric: "2조 원", label: "도심 재정비 투자 계획", body: "2040년까지 재개발·재건축 인프라 구축에 대규모 재원 투입 계획 확정 (2026년 4월 발표)." },
    ],
  },
  {
    category: "인프라 구축",
    items: [
      { metric: "제4테크노밸리", label: "오리역세권 조성 추진", body: "8만개 일자리, 180조 원 매출 전망. 축구장 29개 크기에 인공지능(AI) 연구개발·미래 모빌리티 융합단지 조성. 세계적인 도시 혁신가인 톰 머피 전 피츠버그 시장 명예총괄기획가 공식 위촉" },
      { metric: "포스코 글로벌센터", label: "위례 글로벌센터 유치", body: "향후 10년 간 약 16조원 경제적 파급효과. 부지 4만9308㎡(축구장 7개 규모) 지하 5층·지상 12층 규모. 2026년 4월 착공, 2030년 준공 예정, 상주인력 3,300여 명 예상" },
      { metric: "카이스트 AI", label: "연구원 판교 유치", body: "지하1층·지상 8층 규모 2028년 완공 예정, 현재 공사중. 전국 카이스트 인공지능(AI) 연구개발 및 전문 인력 집결 양성" },
    ],
  },
  {
    category: "교육·복지",
    items: [
      { metric: "대학병원급 진료", label: "성남시 의료원 구축 추진", body: "2024년 12월 분당서울대병원과 협약, 현재 내과·외과·정형외과 등 총 11명 교수진 진료 참여. (2025. 3. ~ 2026. 3) 연간 환자 2439명 진료, 수술 29건 수행." },
      { metric: "과학고", label: "과학고 유치 확정", body: "분당중앙고 → 과학고 전환, 27년 개교 예정. 과학중점학교 지원(경기도 최다 지정 운영: 8개소)." },
      { metric: "확충", label: "공공 교육·보육 인프라", body: "30·40대 유입이 많은 신도시권을 중심으로 공공 돌봄 및 교육·학습 공간 확대." },
    ],
  },
];

export default function Achievements() {
  return (
    <div className="paper-texture">
      <section className="border-b border-ink/15">
        <div className="container pt-20 pb-16">
          <div className="chapter-label">Chapter · Achievements</div>
          <h1 className="mt-6 text-[clamp(2.75rem,7vw,5.5rem)] leading-[1.02]" style={{ color: "var(--color-navy)" }}>
            숫자로 <span style={{ color: "var(--color-brick)" }}>증명한</span><br/>
            4년의 기록.
          </h1>
          <p className="mt-8 max-w-2xl text-[17px] leading-[1.8] text-foreground/80">
            민선 8기 신상진 시정의 성과는 말이 아닌 숫자로 남습니다.
            아래의 기록은 성남시 공약 이행 현황, 국토교통부 발표,
            언론 보도를 바탕으로 정리한 공식 집계입니다.
          </p>
        </div>
      </section>

      <section>
        <div className="container py-20">
          {ACHIEVEMENTS.map((group, gi) => (
            <div key={group.category} className={`reveal ${gi > 0 ? "mt-20" : ""}`}>
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-10">
                <div className="lg:col-span-3">
                  <div className="chapter-label">Section {String(gi + 1).padStart(2, "0")}</div>
                  <h2 className="mt-3 text-3xl md:text-4xl" style={{ color: "var(--color-navy)" }}>
                    {group.category}
                  </h2>
                </div>
                <div className="lg:col-span-9 lg:pl-6 lg:border-l border-ink/20 flex items-end">
                  <div className="font-editorial italic text-sm text-muted-foreground">
                    Category {String(gi + 1).padStart(2, "0")} of {String(ACHIEVEMENTS.length).padStart(2, "0")}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-0 md:gap-px bg-ink/15">
                {group.items.map((item) => (
                  <div key={item.label} className="bg-background p-8 md:p-10">
                    <div className="text-[clamp(2rem,3.5vw,3rem)] font-black leading-none tabular-nums" style={{ fontFamily: "var(--font-serif)", color: "var(--color-brick)" }}>
                      {item.metric}
                    </div>
                    <h3 className="mt-5 text-xl md:text-2xl" style={{ color: "var(--color-navy)" }}>
                      {item.label}
                    </h3>
                    <p className="mt-3 text-[15px] leading-[1.7] text-foreground/75">
                      {item.body}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="border-t border-ink/15">
        <div className="container py-24">
          <div className="max-w-3xl reveal">
            <div className="chapter-label">Editor's Note</div>
            <p className="mt-6 pull-quote" style={{ color: "var(--color-ink)" }}>
              성과는 자랑이 아니라 "다음 약속의 증거"입니다.
              4년간 쌓은 신뢰를 바탕으로, <span style={{ color: "var(--color-brick)" }}>더 과감하게 다음 4년</span>을 설계하겠습니다.
            </p>
            <div className="mt-8 text-sm font-editorial italic text-muted-foreground">
              — Notes from the campaign, April 2026
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
