/**
 * Design: "The Architect of Trust" — Editorial Civic
 * Home page — 매거진 커버 스타일 히어로, Chapter 구조
 */
import { useEffect, useRef, useState } from "react";
import { Link } from "wouter";
import { ArrowUpRight, ArrowRight } from "lucide-react";

const baseUrl = import.meta.env.BASE_URL;
const HERO_IMG = `${baseUrl}images/home/BUNDANG.jpeg`;
const PORTRAIT_IMG = `${baseUrl}images/home/home.jpg`;
const BUNDANG_IMG = `${baseUrl}images/home/bundang.jpg`;

function CountUp({
  end,
  suffix = "",
  duration = 1800,
}: {
  end: number;
  suffix?: string;
  duration?: number;
}) {
  const [value, setValue] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    if (!ref.current) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting && !started.current) {
            started.current = true;
            const startTime = performance.now();
            const tick = (t: number) => {
              const p = Math.min((t - startTime) / duration, 1);
              const eased = 1 - Math.pow(1 - p, 3);
              setValue(end * eased);
              if (p < 1) requestAnimationFrame(tick);
              else setValue(end);
            };
            requestAnimationFrame(tick);
          }
        });
      },
      { threshold: 0.3 }
    );
    io.observe(ref.current);
    return () => io.disconnect();
  }, [end, duration]);

  const formatted = Number.isInteger(end) ? Math.floor(value).toLocaleString() : value.toFixed(1);

  return (
    <span ref={ref} className="tnum">
      {formatted}
      {suffix}
    </span>
  );
}

export default function Home() {
  return (
    <div className="paper-texture">

      {/* =========================================================
          HERO — Editorial Magazine Cover
      ========================================================= */}
      <section className="relative overflow-hidden border-b border-ink/15">
        {/* Top meta bar */}
        <div className="container pt-6 pb-4 flex items-center justify-between text-xs font-editorial italic text-muted-foreground">
          <span>Vol. 2026 · No. 01</span>
          <span className="hidden sm:inline">성남시 제9회 전국동시지방선거 · 2026년 6월 3일</span>
          <span>국민의힘</span>
        </div>
        <div className="hairline container" />

        <div className="container pt-12 md:pt-20 pb-16 md:pb-24 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-end">
          {/* Left: headline */}
          <div className="lg:col-span-7">
            <div className="chapter-label">Chapter 00 · Cover Story</div>
            <h1
              className="mt-6 text-[clamp(2.75rem,7vw,5.75rem)] leading-[1.02]"
              style={{ color: "var(--color-navy)" }}
            >
              시작한 일을
              <br />
              <span style={{ color: "var(--color-brick)" }}>끝까지</span> 책임지는
              <br />
              시장.
            </h1>
            <p className="mt-8 max-w-xl text-[17px] leading-[1.75] text-foreground/80">
              대장동 이후 무너진 시스템을 다시 세우고, 재정자립도 전국 1위와 공약 이행률
              97.4%로 증명한 4년. 이제 성남은 재건축과 재개발, 첨단 산업과 복지 체감을
              동시에 완성해야 할 시간입니다.
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3">
              
            </div>

            {/* Quick stats row */}
            <div className="mt-16 grid grid-cols-3 gap-4 md:gap-8 max-w-2xl">
              {[
                { n: 97.4, s: "%", label: "공약 이행률", sub: "민선 8기" },
                { n: 1, s: "위", label: "재정자립도", sub: "전국 지자체" },
                { n: 0, s: "", prefix: "채무 ", label: "성남시 채무", sub: "2026.01 최종" },
              ].map((s) => (
                <div key={s.label} className="border-t border-ink/30 pt-3">
                  <div
                    className="text-[clamp(1.75rem,3.5vw,2.5rem)] font-black tabular-nums"
                    style={{ color: "var(--color-navy)", fontFamily: "var(--font-serif)" }}
                  >
                    {s.prefix}
                    <CountUp end={s.n} suffix={s.s} />
                  </div>
                  <div className="mt-1 text-sm font-semibold">{s.label}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">{s.sub}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: portrait */}
          <div className="lg:col-span-5 relative">
            <div className="relative aspect-[3/4] overflow-hidden">
              <img
                src={PORTRAIT_IMG}
                alt="신상진 성남시장"
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div
                className="absolute inset-0"
                style={{ background: "linear-gradient(180deg, transparent 55%, rgba(15,42,71,0.6) 100%)" }}
              />
              <div className="absolute bottom-5 left-5 right-5 text-[var(--color-paper)]">
                <div className="font-editorial italic text-xs opacity-80 tracking-widest">PORTRAIT · 2026</div>
                <div className="mt-1 text-lg font-black" style={{ fontFamily: "var(--font-serif)" }}>
                  신상진 — 민선8기 성남시장
                </div>
              </div>
            </div>
            <div className="mt-4 font-editorial italic text-sm text-muted-foreground leading-relaxed">
              "무너진 시스템을 다시 세우는 것에서 시작했습니다.
              <br />
              이제 시민이 체감하는 변화로 완성하겠습니다."
            </div>
          </div>
        </div>
      </section>      

      {/* =========================================================
          CHAPTER 01 — 매니페스토 선언
      ========================================================= */}
      <section className="border-b border-ink/15">
        <div className="container py-24 md:py-32 grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-4 reveal">
            <div className="chapter-label">Chapter 01</div>
            <h2 className="mt-4 text-4xl md:text-5xl" style={{ color: "var(--color-navy)" }}>
              선언
            </h2>
            <p className="mt-4 text-sm text-muted-foreground">THE MANIFESTO</p>
          </div>
          <div className="lg:col-span-8 reveal">
            <p className="pull-quote" style={{ color: "var(--color-ink)" }}>
              "정치는 구호가 아니라 숫자로 증명해야 합니다. 성남은 재정으로 독립했고, 약속으로
              신뢰를 회복했으며, 이제 <span style={{ color: "var(--color-brick)" }}>재건축과 재개발로 도시의 미래</span>를 완성할 차례입니다."
            </p>
            <div className="mt-10 flex items-center gap-4">
              <div className="w-12 h-px bg-ink/50" />
              <div className="text-sm font-editorial italic text-muted-foreground">
                — 신상진, 2026 출마 선언문 中
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          CHAPTER 02 — 성과 하이라이트 (3단 에디토리얼)
      ========================================================= */}
      <section className="border-b border-ink/15">
        <div className="container py-24 md:py-28">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 mb-16">
            <div className="lg:col-span-5">
              <div className="chapter-label">Chapter 02</div>
              <h2 className="mt-4 text-4xl md:text-5xl" style={{ color: "var(--color-navy)" }}>
                숫자로 증명한
                <br />
                4년의 시정
              </h2>
            </div>
            <div className="lg:col-span-6 lg:col-start-7 reveal">
              <p className="text-[17px] leading-[1.8] text-foreground/80">
                민선 8기 신상진 시정은 148개 공약 중 134개를 완료 및 정상 추진하며{" "}
                <strong className="text-[var(--color-navy)]">이행률 97.4%</strong>를 달성했습니다.
                동시에 재정자립도 전국 1위라는 재정 건전성과 분당 재건축 선도지구 지정이라는 도시
                정비의 돌파구를 동시에 만들어냈습니다.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-0 md:gap-px bg-ink/20">
            {[
              {
                ch: "02 · A",
                title: "재건축 선도지구 지정",
                body: "분당 시범단지, 샛별마을, 목련마을, 양지마을 등 4개 단지 2만여 세대의 재건축 특별정비구역 지정을 확정. 1기 신도시 재건축의 첫 장을 성남에서 열었습니다.",
                metric: "2.0만",
                unit: "세대",
              },
              {
                ch: "02 · B",
                title: "원도심 재개발 정상화",
                body: "수진1·태평3·산성·단대·상대원2·3 등 수정·중원 26개 구역 정비계획 수립을 본격화하며 2026년 말 구역 지정을 목표로 추진. 원도심 주거 환경 개선의 청사진을 완성합니다.",
                metric: "26",
                unit: "개 구역",
              },
              {
                ch: "02 · C",
                title: "재정자립도 전국 1위",
                body: '경기도 31개 시·군 중 최고 수준의 재정 건전성 확보. 건전한 재정 운영을 바탕으로 "도시 미래를 위한 투자"로 노후 도시 정비사업의 속도와 실효성을 높이기 위해 재개발·재건축에 2조 원 규모의 인프라 투자를 집행합니다.',
                metric: "2조",
                unit: "원 투입 예정",
              },
            ].map((item) => (
              <div key={item.ch} className="bg-background p-8 md:p-10 reveal">
                <div className="chapter-label">{item.ch}</div>
                <div className="mt-8 flex items-baseline gap-2">
                  <span className="text-5xl font-black tabular-nums" style={{ fontFamily: "var(--font-serif)", color: "var(--color-brick)" }}>
                    {item.metric}
                  </span>
                  <span className="text-sm font-semibold">{item.unit}</span>
                </div>
                <h3 className="mt-4 text-2xl" style={{ color: "var(--color-navy)" }}>
                  {item.title}
                </h3>
                <p className="mt-3 text-[15px] leading-[1.7] text-foreground/75">{item.body}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 text-right">
            <Link href="/achievements" className="link-underline text-sm font-medium inline-flex items-center gap-1">
              
            </Link>
          </div>
        </div>
      </section>

      {/* =========================================================
          CHAPTER 03 — 지역별 약속 (3 columns with image)
      ========================================================= */}
      <section className="border-b border-ink/15">
        <div className="container py-24 md:py-28">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 mb-16">
            <div className="lg:col-span-5">
              <div className="chapter-label">Chapter 03 · Districts</div>
              <h2 className="mt-4 text-4xl md:text-5xl" style={{ color: "var(--color-navy)" }}>
                세 도시,
                <br />
                세 약속.
              </h2>
            </div>
            <div className="lg:col-span-6 lg:col-start-7 reveal">
              <p className="text-[17px] leading-[1.8] text-foreground/80">
                수정·중원·분당. 성남의 세 지역구는 서로 다른 역사와 현안을 가집니다. 우리는 하나의
                구호가 아닌, 세 개의 맞춤형 약속으로 답합니다.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
            {/* Left: big image */}
            <div className="lg:col-span-6 reveal">
              <div className="relative aspect-[4/5] overflow-hidden">
                <img
                  src={BUNDANG_IMG}
                  alt="분당 재건축 현장"
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div
                  className="absolute bottom-0 left-0 right-0 p-6 text-[var(--color-paper)]"
                  style={{ background: "linear-gradient(0deg, rgba(15,42,71,0.85), transparent)" }}
                >
                  <div className="font-editorial italic text-xs opacity-80 tracking-widest">FIELD NOTE</div>
                  <div className="mt-1 text-lg font-black" style={{ fontFamily: "var(--font-serif)" }}>
                    분당구 — 재건축의 최전선
                  </div>
                </div>
              </div>
            </div>

            {/* Right: 3 districts */}
            <div className="lg:col-span-6 flex flex-col gap-6">
              {[
                {
                  code: "03 · 분당구",
                  title: "재건축 완수와 시정 연속성",
                  pop: "469,015",
                  body: "시범단지·샛별마을·목련마을·양지마을 4개 선도지구 4개 단지의 특별정비구역 지정을 2026년 내 마무리. 용적률 326%(최대 450%) 상향과 합리적 공공기여로 주민 부담을 최소화합니다.",
                },
                {
                  code: "03 · 수정구",
                  title: "원도심 재생과 신도시 균형",
                  pop: "234,336",
                  body: "수진1·태평3·산성·단대 등 26개 구역 재개발 정비구역 지정 완료. 위례신도시 교통망(위례-삼동선)과 원도심 주거 개선을 한 축으로 묶습니다.",
                },
                {
                  code: "03 · 중원구",
                  title: "민생과 성남하이테크밸리",
                  pop: "202,142",
                  body: "상대원2·3구역 재개발 본격화와 성남하이테크밸리 고도화로 일자리-주거-복지의 삼각 연계를 완성. 고령층 체감 복지를 두텁게 강화합니다.",
                },
              ].map((d) => (
                <div key={d.code} className="reveal group border-t border-ink/30 pt-6">
                  <div className="flex items-baseline justify-between gap-4">
                    <div className="chapter-label">{d.code}</div>
                    <div className="text-xs text-muted-foreground tabular-nums">인구 {d.pop}명</div>
                  </div>
                  <h3 className="mt-3 text-2xl transition-colors group-hover:text-[var(--color-brick)]" style={{ color: "var(--color-navy)" }}>
                    {d.title}
                  </h3>
                  <p className="mt-2 text-[15px] leading-[1.7] text-foreground/75">{d.body}</p>
                </div>
              ))}
              <Link href="/analysis" className="link-underline text-sm font-medium inline-flex items-center gap-1 mt-2">
                
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          CHAPTER 04 — CTA / Skyline full-bleed
      ========================================================= */}
      <section className="relative" style={{ background: "var(--color-navy)" }}>
        <div className="absolute inset-0 opacity-99">
          <img src={HERO_IMG} alt="성남 스카이라인" className="w-full h-full object-cover" />
        </div>
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(180deg, rgba(15,42,71,0.5), rgba(15,42,71,0.95))" }}
        />

        <div className="relative container py-28 md:py-40 text-[var(--color-paper)]">
          <div className="max-w-4xl">
            <div className="chapter-label" style={{ color: "var(--color-gold)" }}>
              Chapter 04 · The Promise
            </div>
            <h2 className="mt-6 text-[clamp(2.3rem,5.5vw,4.5rem)] leading-[1.05]" style={{ color: "var(--color-paper)" }}>
              성남의 미래,
              <br />
              <span style={{ color: "var(--color-gold)" }}>완성할 시간</span>입니다.
            </h2>
            <p className="mt-8 text-lg leading-[1.8] opacity-100 max-w-2xl">
              2026년 6월 3일, 시민 여러분의 한 표가 성남의 다음 4년을 결정합니다. 검증된
              행정, 책임지는 리더십, 시민이 체감하는 변화로 답하겠습니다.
            </p>
            <div className="mt-12 flex flex-wrap gap-5">
            
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
