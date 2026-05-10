/**
 * Design: "The Architect of Trust" — Editorial Civic
 * About page — 후보 약력, 철학, 발자취
 */
const PORTRAIT_IMG = `${import.meta.env.BASE_URL}images/home/home.jpg`;

const TIMELINE = [
  { year: "2022–", title: "민선 8기 성남시장", body: "공약 이행률 96.1% 달성, 재정자립도 전국 1위 유지, 분당 재건축 선도지구 지정 주도." },
  { year: "2016–2020", title: "제20대 국회의원 (성남 중원구)", body: "지역 현안 해결에 집중하며 성남과의 인연을 다짐." },
  { year: "2020–2022", title: "성남시장 복귀 준비기", body: "지역 민생 현장 밀착, 시정 구상 및 정책 연구." },
  { year: "2005–2015", title: "제17·18·19대 국회의원", body: "복지·의료·교육 분야 입법 활동, 의사 출신 전문성을 기반으로 한 정책 설계." },
  { year: "1982–2001", title: "의사, 제32대 대한의사협회 회장", body: "제32대 대한의사협회 회장으로 의료 활동을 동반하며 사람과 생명을 우선하는 행정 철학의 토대를 마련." },
];

const VALUES = [
  { k: "책임", v: "시작한 일은 끝까지 완수한다." },
  { k: "투명", v: "숫자로 증명하는 행정을 만든다." },
  { k: "현장", v: "시민의 목소리가 정책의 출발점이다." },
  { k: "연속", v: "시정의 성과는 중단 없이 이어져야 한다." },
];

export default function About() {
  return (
    <div className="paper-texture">
      {/* Header */}
      <section className="border-b border-ink/15">
        <div className="container pt-20 pb-16">
          <div className="chapter-label">The Candidate</div>
          <h1
            className="mt-6 text-[clamp(3rem,7vw,6rem)] leading-[1.02]"
            style={{ color: "var(--color-navy)" }}
          >
            신상진
          </h1>
          <p className="mt-4 font-editorial italic text-lg text-muted-foreground">
            Mayor · Physician · Public Servant
          </p>
        </div>
      </section>

      {/* Portrait + Bio */}
      <section className="border-b border-ink/15">
        <div className="container py-20 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
          <div className="lg:col-span-5 reveal">
            <div className="relative aspect-[3/4] overflow-hidden">
              <img
                src={PORTRAIT_IMG}
                alt="신상진 시장"
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>
            <div className="mt-4 font-editorial italic text-xs tracking-widest text-muted-foreground">
              PORTRAIT · SEONGNAM CITY HALL · 2026
            </div>
          </div>

          <div className="lg:col-span-7 reveal">
            <div className="chapter-label">Profile</div>
            <h2
              className="mt-4 text-3xl md:text-4xl"
              style={{ color: "var(--color-navy)" }}
            >
              사람을 살리던 손으로,
              <br />
              도시를 일으키는 시장.
            </h2>
            <p className="mt-8 text-[17px] leading-[1.85] text-foreground/80">
              신상진 후보는 제32대 대한의사협회 회장으로 의료 활동을 하며 사람의 생명과 민생 정치를 지켰고,
              17·18·19·20대 국회의원으로 정책을 설계했으며,
              민선 8기 성남시장으로 대장동 이후 흔들렸던 행정 신뢰를 다시 세웠습니다.
            </p>
            <p className="mt-5 text-[17px] leading-[1.85] text-foreground/80">
              성남시장 현직시절 "시정은 구호가 아니라 숫자로 증명해야 한다"는 원칙을 고수해 왔으며,
              148개 공약 중 127개 이행, 재정자립도 전국 1위, 분당 재건축 선도지구 지정이라는
              구체적인 숫자들이 그 원칙의 결과임을 보여 주었습니다.
            </p>

            <div className="mt-10 grid grid-cols-2 gap-px bg-ink/20">
              {VALUES.map((item) => (
                <div key={item.k} className="bg-background p-6">
                  <div
                    className="text-4xl font-black"
                    style={{
                      color: "var(--color-brick)",
                      fontFamily: "var(--font-serif)",
                    }}
                  >
                    {item.k}
                  </div>
                  <div className="mt-3 text-sm text-foreground/75 leading-relaxed">
                    {item.v}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="border-b border-ink/15">
        <div className="container py-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 mb-14">
            <div className="lg:col-span-5">
              <div className="chapter-label">A Life in Public Service</div>
              <h2
                className="mt-4 text-4xl md:text-5xl"
                style={{ color: "var(--color-navy)" }}
              >
                발자취
              </h2>
            </div>
            <div className="lg:col-span-6 lg:col-start-7 reveal">
              <p className="text-[17px] leading-[1.8] text-foreground/80">
                의료 현장에서 정치로, 다시 행정으로. 신상진은 40년 넘게
                공공의 영역에서 시민의 삶을 가까이에서 마주해 왔습니다.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1">
            {TIMELINE.map((t, i) => (
              <div
                key={i}
                className="reveal grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-8 py-8 border-t border-ink/20"
              >
                <div className="md:col-span-3">
                  <div
                    className="font-editorial italic text-xl"
                    style={{ color: "var(--color-brick)" }}
                  >
                    {t.year}
                  </div>
                </div>
                <div className="md:col-span-9">
                  <h3 className="text-2xl" style={{ color: "var(--color-navy)" }}>
                    {t.title}
                  </h3>
                  <p className="mt-2 text-[16px] leading-[1.75] text-foreground/75">
                    {t.body}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pull quote */}
      <section>
        <div className="container py-28">
          <div className="max-w-4xl mx-auto reveal">
            <div className="chapter-label text-center">In His Own Words</div>
            <blockquote
              className="mt-10 pull-quote text-center"
              style={{ color: "var(--color-ink)" }}
            >
              "저는 화려한 말 대신, 행동으로 해낸 일의 숫자로 시민 앞에 서왔습니다.
              다음 4년도, 행동으로 시민과{" "}
              <span style={{ color: "var(--color-brick)" }}>
                "함께" 성남의 미래
              </span>
              를 만들겠습니다."
            </blockquote>
            <div className="mt-8 text-center font-editorial italic text-sm text-muted-foreground">
              — 신상진, 2026년 출마 선언
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
