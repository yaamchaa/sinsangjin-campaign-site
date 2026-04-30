/**
 * Design: "The Architect of Trust" — Editorial Civic
 * Pledges — 5대 핵심 공약 (매거진 기사식 구성)
 */
const PLEDGES = [
  {
    no: "01",
    title: "완성하는 재건축",
    subtitle: "분당 선도지구 전 구역, 임기 내 착공까지",
    body: "시범단지·샛별마을·목련마을·양지마을 등 4개 선도지구 단지의 특별정비구역 지정을 완료한 이 흐름을 멈추지 않겠습니다. 용적률 326%(최대 450%) 상향과 합리적 공공기여 협상으로 주민 부담을 최소화하고, 분당 재건축 전 구역을 임기 내 착공 단계로 진입시키겠습니다.",
    metric: "2.0만",
    metricLabel: "세대 재건축",
    district: "분당구",
  },
  {
    no: "02",
    title: "살아나는 원도심",
    subtitle: "수정·중원 26개 구역, 2026년 추가 정비구역 지정",
    body: "수진1·태평3·산성·단대·상대원2·3구역 등 26개 재개발 구역의 정비계획 수립을 2026년 말까지 마무리합니다. 총 1만 1천여 세대의 신규 주거 공급과 함께 임대주택 2,476세대를 공존시켜 원도심의 주거 사다리를 복원합니다.",
    metric: "1.1만",
    metricLabel: "세대 공급",
    district: "수정·중원",
  },
  {
    no: "03",
    title: "연결되는 교통",
    subtitle: "야탑도촌역·위례-삼동선, 교통 사각지대 해소",
    body: "국토부와 협의 중인 야탑도촌역 신설을 확정 단계로 끌어올리고, 위례-삼동선 조기 개통을 통해 신도시·원도심·외곽을 촘촘하게 잇겠습니다. 30분 통근권 성남을 완성하여 시민의 시간을 돌려드립니다.",
    metric: "30분",
    metricLabel: "통근권 완성",
    district: "전 지역",
  },
  {
    no: "04",
    title: "성장하는 하이테크",
    subtitle: "판교-성남하이테크밸리 산업 벨트 고도화",
    body: "판교 1·2테크노밸리의 혁신 동력을 성남하이테크밸리(중원구)로 확산하여 제조·연구·서비스가 연계된 성남형 산업 벨트와 오리역 제4 판교 혁신산업 클러스터 테크노밸리를 구측합니다. 지역 청년 고용과 소상공인 상권 활성화가 동시에 이뤄지도록 공공기여금을 성남 일자리 기금으로 연계합니다.",
    metric: "2조",
    metricLabel: "인프라 투자",
    district: "전 지역",
  },
  {
    no: "05",
    title: "두터워지는 복지",
    subtitle: "고령·돌봄·의료 체감도 전국 상위권",
    body: "의사 출신 시장의 전문성을 살려 공공의료·치매안심·돌봄 서비스 체계를 재정비합니다. 중원·수정구의 고령층 복지를 두텁게, 분당·위례의 청년·육아 지원을 촘촘하게. 시민이 체감하는 안전 복지로 답하겠습니다.",
    metric: "전 세대",
    metricLabel: "체감 복지",
    district: "전 지역",
  },
];

export default function Pledges() {
  return (
    <div className="paper-texture">
      <section className="border-b border-ink/15">
        <div className="container pt-20 pb-16">
          <div className="chapter-label">Chapter · The Pledges</div>
          <h1 className="mt-6 text-[clamp(2.75rem,7vw,5.5rem)] leading-[1.02]" style={{ color: "var(--color-navy)" }}>
            다섯 개의<br/>
            <span style={{ color: "var(--color-brick)" }}>약속</span>.
          </h1>
          <p className="mt-8 max-w-2xl text-[17px] leading-[1.8] text-foreground/80">
            신상진의 다음 4년은 다섯 가지의 구체적인 약속으로 설계됐습니다.
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
              이 다섯 개의 약속은 "제 임기의 계약서"입니다.
              시민이 <span style={{ color: "var(--color-brick)" }}>평가하고, 채점하고, 책임을 물을 수 있는</span> 계약이 되겠습니다.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
