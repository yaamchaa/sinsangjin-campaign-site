/**
 * Design: "The Architect of Trust" — Editorial Civic
 * Analysis — 성남시 유권자 분석 보고서 (recharts 기반)
 */
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  CartesianGrid,
  PieChart,
  Pie,
  Legend,
} from "recharts";

const POP_DATA = [
  { name: "수정구", pop: 234877, households: 116838, elderly: 19.6 },
  { name: "중원구", pop: 206978, households: 100556, elderly: 20.0 },
  { name: "분당구", pop: 471154, households: 192848, elderly: 15.6 },
];

const SHARE_DATA = [
  { name: "분당구", value: 471154, color: "var(--color-navy)" },
  { name: "수정구", value: 234877, color: "var(--color-brick)" },
  { name: "중원구", value: 206978, color: "var(--color-gold)" },
];

const DISTRICT_DEEPDIVE = [
  {
    code: "01",
    name: "분당구",
    tagline: "재건축과 시정 연속성의 최대 승부처",
    population: "469,015명 · 성남시 인구의 51.6%",
    voter_profile: "40~50대 중산층 비중 최다, 부동산·교육 민감도 매우 높음. IT·판교 종사자 중심의 전문직 유권자 집중.",
    key_issue: "1기 신도시 재건축 선도지구 지정 이후 추진 속도. 용적률·공공기여·분담금 민감 이슈.",
    strategy: "'재건축을 시작한 시장이 끝까지 책임진다' 프레임. 국토부 협상 실적 가시화. 시정 연속성 메시지 집중.",
  },
  {
    code: "02",
    name: "수정구",
    tagline: "원도심과 신도시가 공존하는 균형 지역",
    population: "234,336명 · 세대수 116,838",
    voter_profile: "위례신도시 유입 3040 젊은 유권자 + 원도심 고령 유권자 혼재. 생활권·교통 이슈 민감도 높음.",
    key_issue: "수진1·태평3·산성·단대 등 26개 재개발 구역 지정, 위례-삼동선 등 교통망 확충.",
    strategy: "원도심 주거 환경 개선 공약 + 위례신도시 교통 연결 공약 병행 제시. 세대 간 균형 메시지.",
  },
  {
    code: "03",
    name: "중원구",
    tagline: "민생과 복지 체감도가 표심을 가르는 격전지",
    population: "202,142명 · 65세 이상 20.0%",
    voter_profile: "성남시 내 고령 인구 비율 최고. 전통적 지지세와 야권 지지세가 팽팽. 자영업·소상공인 비중 높음.",
    key_issue: "상대원2·3 재개발, 성남하이테크밸리 고도화, 노인 복지·공공의료 강화.",
    strategy: "'민생 시장' 브랜드 강화. 공약 이행률 96.1% 성과를 통한 신뢰 기반 확보. 의사 출신 전문성 강조.",
  },
];

const navy = "#0F2A47";
const brick = "#B84A2E";
const gold = "#A8854C";

export default function Analysis() {
  return (
    <div className="paper-texture">
      <section className="border-b border-ink/15">
        <div className="container pt-20 pb-16">
          <div className="chapter-label">Voter Analysis Report · 2026</div>
          <h1 className="mt-6 text-[clamp(2.75rem,7vw,5.5rem)] leading-[1.02]" style={{ color: "var(--color-navy)" }}>
            성남,<br/>
            <span style={{ color: "var(--color-brick)" }}>세 도시</span>의 표심.
          </h1>
          <p className="mt-8 max-w-2xl text-[17px] leading-[1.8] text-foreground/80">
            수정·중원·분당은 이름만 같은 도시가 아닙니다.
            인구 구조, 세대 구성, 핵심 현안이 모두 다릅니다.
            이 보고서는 2024년 12월 성남시 주민등록인구 통계를 바탕으로
            2026 지방선거의 세 전선을 분석합니다.
          </p>
          <div className="mt-10 font-editorial italic text-sm text-muted-foreground">
            Data sources · 성남시 주민등록인구 통계(2024.12.31) / 민선 8기 공약 이행 현황(2026.01) / 국토교통부 1기 신도시 선도지구 지정 발표(2025.12)
          </div>
        </div>
      </section>

      {/* Overview numbers */}
      <section className="border-b border-ink/15">
        <div className="container py-20">
          <div className="chapter-label">01 · At a Glance</div>
          <h2 className="mt-4 text-4xl md:text-5xl mb-14" style={{ color: "var(--color-navy)" }}>
            한눈에 보는 성남시
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-0 md:gap-px bg-ink/15">
            {[
              { n: "905,493", l: "총 인구", s: "2026.03 기준" },
              { n: "410,242", l: "총 세대수", s: "평균 2.2명/세대" },
              { n: "17.6%", l: "65세 이상 비율", s: "161,299명" },
              { n: "141.63㎢", l: "성남시 면적", s: "수·중·분 합산" },
            ].map((s) => (
              <div key={s.l} className="bg-background p-8 reveal">
                <div className="text-[clamp(2rem,3vw,2.75rem)] font-black tabular-nums leading-none" style={{ fontFamily: "var(--font-serif)", color: "var(--color-navy)" }}>
                  {s.n}
                </div>
                <div className="mt-4 text-sm font-semibold">{s.l}</div>
                <div className="text-xs text-muted-foreground mt-1">{s.s}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Charts */}
      <section className="border-b border-ink/15">
        <div className="container py-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            <div className="lg:col-span-6 reveal">
              <div className="chapter-label">02 · District Population</div>
              <h2 className="mt-4 text-3xl md:text-4xl" style={{ color: "var(--color-navy)" }}>
                지역구별 인구 분포
              </h2>
              <p className="mt-4 text-[15px] text-foreground/75 leading-relaxed">
                분당구가 성남시 전체 인구의 절반을 넘어선 51.6%로,
                단일 선거 블록으로는 가장 큰 비중을 차지합니다.
              </p>
              <div className="mt-8 h-[360px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={SHARE_DATA}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={130}
                      innerRadius={70}
                      stroke="#F5F1E8"
                      strokeWidth={3}
                      label={({ name, percent }) =>
                        `${name} ${((percent ?? 0) * 100).toFixed(1)}%`
                      }
                      labelLine={false}
                    >
                      {SHARE_DATA.map((d, i) => (
                        <Cell key={i} fill={i === 0 ? navy : i === 1 ? brick : gold} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(v: number) => v.toLocaleString() + "명"}
                      contentStyle={{
                        background: "#F5F1E8",
                        border: "1px solid #1A1A1A",
                        borderRadius: 0,
                        fontFamily: "Pretendard, sans-serif",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="lg:col-span-6 reveal">
              <div className="chapter-label">03 · Elderly Ratio</div>
              <h2 className="mt-4 text-3xl md:text-4xl" style={{ color: "var(--color-navy)" }}>
                고령 인구 비율 (65세 이상)
              </h2>
              <p className="mt-4 text-[15px] text-foreground/75 leading-relaxed">
                중원구는 20.0%로 성남시 평균(17.6%)을 크게 상회.
                복지·의료·주거 공약이 가장 강하게 작동하는 지역입니다.
              </p>
              <div className="mt-8 h-[360px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={POP_DATA} margin={{ top: 20, right: 20, bottom: 20, left: 0 }}>
                    <CartesianGrid stroke="#1A1A1A20" vertical={false} />
                    <XAxis dataKey="name" tick={{ fontFamily: "Pretendard", fontSize: 13, fill: "#1A1A1A" }} axisLine={{ stroke: "#1A1A1A40" }} tickLine={false} />
                    <YAxis unit="%" tick={{ fontFamily: "Pretendard", fontSize: 12, fill: "#1A1A1A80" }} axisLine={false} tickLine={false} />
                    <Tooltip
                      formatter={(v: number) => v + "%"}
                      contentStyle={{
                        background: "#F5F1E8",
                        border: "1px solid #1A1A1A",
                        borderRadius: 0,
                        fontFamily: "Pretendard, sans-serif",
                      }}
                    />
                    <Bar dataKey="elderly" name="65세 이상 비율" radius={0}>
                      {POP_DATA.map((_, i) => (
                        <Cell key={i} fill={i === 0 ? brick : i === 1 ? navy : gold} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <div className="mt-16 reveal">
            <div className="chapter-label">04 · Population Detail</div>
            <h2 className="mt-4 text-3xl md:text-4xl mb-8" style={{ color: "var(--color-navy)" }}>
              지역구별 인구·세대 상세
            </h2>
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={POP_DATA} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                  <CartesianGrid stroke="#1A1A1A20" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontFamily: "Pretendard", fontSize: 14, fill: "#1A1A1A" }} axisLine={{ stroke: "#1A1A1A40" }} tickLine={false} />
                  <YAxis tick={{ fontFamily: "Pretendard", fontSize: 12, fill: "#1A1A1A80" }} axisLine={false} tickLine={false} />
                  <Tooltip
                    formatter={(v: number) => v.toLocaleString() + (v > 300000 ? "명" : v > 100000 ? "명/세대" : "")}
                    contentStyle={{
                      background: "#F5F1E8",
                      border: "1px solid #1A1A1A",
                      borderRadius: 0,
                      fontFamily: "Pretendard, sans-serif",
                    }}
                  />
                  <Legend wrapperStyle={{ fontFamily: "Pretendard, sans-serif", fontSize: 13 }} />
                  <Bar dataKey="pop" name="인구수 (명)" fill={navy} radius={0} />
                  <Bar dataKey="households" name="세대수" fill={brick} radius={0} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </section>

      {/* Deep dive */}
      <section className="border-b border-ink/15">
        <div className="container py-24">
          <div className="chapter-label">05 · District Deep Dive</div>
          <h2 className="mt-4 text-4xl md:text-5xl mb-16" style={{ color: "var(--color-navy)" }}>
            세 도시의 전선
          </h2>

          <div className="space-y-0">
            {DISTRICT_DEEPDIVE.map((d, i) => (
              <div key={d.code} className={`reveal grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 py-12 ${i < DISTRICT_DEEPDIVE.length - 1 ? "border-b border-ink/20" : ""}`}>
                <div className="lg:col-span-3">
                  <div className="font-editorial italic text-sm tracking-widest uppercase text-muted-foreground">District {d.code}</div>
                  <h3 className="mt-2 text-4xl" style={{ color: "var(--color-navy)" }}>
                    {d.name}
                  </h3>
                  <div className="mt-3 text-sm text-foreground/70 tabular-nums">{d.population}</div>
                </div>
                <div className="lg:col-span-9">
                  <div className="pull-quote mb-8" style={{ color: "var(--color-brick)", fontStyle: "italic" }}>
                    "{d.tagline}"
                  </div>
                  <dl className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
                    <div>
                      <dt className="chapter-label">Voter Profile</dt>
                      <dd className="mt-3 text-[15px] leading-[1.75] text-foreground/80">{d.voter_profile}</dd>
                    </div>
                    <div>
                      <dt className="chapter-label">Key Issue</dt>
                      <dd className="mt-3 text-[15px] leading-[1.75] text-foreground/80">{d.key_issue}</dd>
                    </div>
                    <div>
                      <dt className="chapter-label" style={{ color: "var(--color-navy)" }}>Strategy</dt>
                      <dd className="mt-3 text-[15px] leading-[1.75] font-semibold" style={{ color: "var(--color-navy)" }}>{d.strategy}</dd>
                    </div>
                  </dl>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Strategic summary */}
      <section style={{ background: "var(--color-navy)", color: "var(--color-paper)" }}>
        <div className="container py-24">
          <div className="chapter-label" style={{ color: "var(--color-gold)" }}>06 · Strategic Summary</div>
          <h2 className="mt-4 text-4xl md:text-5xl mb-14" style={{ color: "var(--color-paper)" }}>
            신상진 필승 전략 4원칙
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                n: "원칙 1",
                t: "성과 중심 '유능한 행정가' 브랜드",
                b: "공약 이행률 96.1%, 재정자립도 전국 1위. 숫자로 말하고 숫자로 증명하는 시장 브랜드를 전면에 배치합니다.",
              },
              {
                n: "원칙 2",
                t: "재건축·재개발 이슈 선점",
                b: "분당 선도지구 지정 주도자라는 포지션을 강화. 시정 연속성이 주민 이익과 직결됨을 설득합니다.",
              },
              {
                n: "원칙 3",
                t: "지역 맞춤형 핀셋 공약",
                b: "분당(재건축)·수정(교통·균형)·중원(민생·복지)으로 세분화된 맞춤 메시지. 하나의 구호가 아닌 세 개의 약속.",
              },
              {
                n: "원칙 4",
                t: "디지털 에디토리얼 소통",
                b: "본 홈페이지를 중심으로 시사 매거진형 콘텐츠 전략 운영. 3040 전문직과 4050 중산층을 동시에 소통합니다.",
              },
            ].map((s) => (
              <div key={s.n} className="border-t border-white/25 pt-6">
                <div className="chapter-label" style={{ color: "var(--color-gold)" }}>{s.n}</div>
                <h3 className="mt-3 text-2xl md:text-3xl" style={{ color: "var(--color-paper)", fontFamily: "var(--font-serif)" }}>
                  {s.t}
                </h3>
                <p className="mt-3 text-[15px] leading-[1.8] opacity-85">
                  {s.b}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
