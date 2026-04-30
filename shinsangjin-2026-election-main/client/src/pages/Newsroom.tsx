/**
 * 뉴스룸 (Media Center)
 * Editorial Civic Design — 신문 인덱스 + 매거진 카드 혼합
 * 카테고리 필터 + 카드 그리드 + 외부 링크
 */
import { useMemo, useState } from "react";
import { trpc } from "@/lib/trpc";
import { ArrowUpRight, FileText, Mic, Newspaper, Play } from "lucide-react";

const FILTERS = [
  { v: "all", label: "전체", en: "All" },
  { v: "press", label: "보도자료", en: "Press" },
  { v: "interview", label: "인터뷰", en: "Interview" },
  { v: "media", label: "언론 기사", en: "Media" },
  { v: "video", label: "영상", en: "Video" },
] as const;

const ICONS: Record<string, React.ReactNode> = {
  press: <FileText className="w-3.5 h-3.5" />,
  interview: <Mic className="w-3.5 h-3.5" />,
  media: <Newspaper className="w-3.5 h-3.5" />,
  video: <Play className="w-3.5 h-3.5" />,
};

const CATEGORY_LABEL: Record<string, string> = {
  press: "보도자료",
  interview: "인터뷰",
  media: "언론 기사",
  video: "영상",
};

const CATEGORY_COLOR: Record<string, string> = {
  press: "var(--color-navy)",
  interview: "var(--color-brick)",
  media: "var(--color-ink)",
  video: "var(--color-gold)",
};

export default function Newsroom() {
  const [filter, setFilter] = useState<(typeof FILTERS)[number]["v"]>("all");
  const newsQuery = trpc.news.list.useQuery();

  const filtered = useMemo(() => {
    const items = newsQuery.data ?? [];
    if (filter === "all") return items;
    return items.filter((n) => n.category === filter);
  }, [filter, newsQuery.data]);

  const featured = filtered[0];
  const rest = filtered.slice(1);

  return (
    <div className="paper-texture">
      {/* ============== HERO ============== */}
      <section className="border-b border-ink/15">
        <div className="container py-20 md:py-28">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-end">
            <div className="lg:col-span-8">
              <div className="chapter-label">Newsroom · Media Center</div>
              <h1
                className="mt-6 text-[clamp(2.5rem,6vw,4.75rem)] leading-[1.05]"
                style={{ color: "var(--color-navy)" }}
              >
                기록되는 시정,
                <br />
                <span style={{ color: "var(--color-brick)" }}>읽히는</span> 약속.
              </h1>
              <p className="mt-6 max-w-xl text-[17px] leading-[1.8] text-foreground/80">
                보도자료, 언론 인터뷰, 시정 영상까지 — 신상진 캠프의 모든 공식
                기록을 한곳에서 확인하실 수 있습니다.
              </p>
            </div>
            <div className="lg:col-span-4">
              <div className="border-t border-ink/30 pt-6">
                <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                  Press Inquiry
                </div>
                <div className="mt-4 space-y-1 text-sm text-foreground/80">
                  <div>언론 문의 · 신상진 캠프 공보팀</div>
                  <div className="font-editorial italic text-muted-foreground">
                    press@seongnam2026.kr
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============== FILTER BAR ============== */}
      <section className="border-b border-ink/15 sticky top-[72px] z-20" style={{ background: "var(--color-paper)" }}>
        <div className="container py-4 flex items-center gap-2 overflow-x-auto">
          {FILTERS.map((f) => {
            const active = filter === f.v;
            return (
              <button
                key={f.v}
                onClick={() => setFilter(f.v)}
                className="px-4 py-2 text-sm font-medium whitespace-nowrap transition-all"
                style={{
                  background: active ? "var(--color-navy)" : "transparent",
                  color: active ? "var(--color-paper)" : "var(--color-ink)",
                  border: `1px solid ${active ? "var(--color-navy)" : "rgba(0,0,0,0.15)"}`,
                }}
              >
                {f.label}
                <span className="ml-2 font-editorial italic text-xs opacity-60">
                  {f.en}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* ============== CONTENT ============== */}
      <section>
        <div className="container py-16 md:py-20">
          {newsQuery.isLoading && (
            <div className="text-sm text-muted-foreground py-12 text-center">
              불러오는 중...
            </div>
          )}

          {!newsQuery.isLoading && filtered.length === 0 && (
            <div className="border border-dashed border-ink/20 py-16 text-center">
              <Newspaper className="w-7 h-7 mx-auto text-muted-foreground" />
              <p className="mt-4 text-sm text-foreground/70">
                해당 카테고리의 기사가 없습니다.
              </p>
            </div>
          )}

          {/* Featured (1 large) */}
          {featured && (
            <article className="border-b border-ink/30 pb-12 mb-12 group">
              <a
                href={featured.link ?? "#"}
                target="_blank"
                rel="noopener"
                className="block"
              >
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
                  <div className="lg:col-span-3">
                    <div className="chapter-label">Featured</div>
                    <div
                      className="mt-3 text-2xl md:text-3xl font-black tabular-nums"
                      style={{
                        fontFamily: "var(--font-serif)",
                        color: "var(--color-brick)",
                      }}
                    >
                      {new Date(featured.publishedAt).toLocaleDateString("ko-KR", {
                        month: "2-digit",
                        day: "2-digit",
                      })}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {new Date(featured.publishedAt).getFullYear()}
                    </div>
                  </div>
                  <div className="lg:col-span-9">
                    <div className="flex items-baseline gap-2">
                      <span
                        className="inline-flex items-center gap-1 text-[10px] font-bold tracking-[0.18em] px-2 py-1"
                        style={{
                          color: CATEGORY_COLOR[featured.category],
                          border: `1px solid ${CATEGORY_COLOR[featured.category]}`,
                        }}
                      >
                        {ICONS[featured.category]}
                        {CATEGORY_LABEL[featured.category]}
                      </span>
                      <span className="text-xs text-muted-foreground font-editorial italic">
                        {featured.source}
                      </span>
                    </div>
                    <h2
                      className="mt-4 text-3xl md:text-4xl leading-[1.2] transition-colors group-hover:text-[var(--color-brick)]"
                      style={{ color: "var(--color-navy)" }}
                    >
                      {featured.title}
                    </h2>
                    <p className="mt-4 text-[16px] leading-[1.8] text-foreground/75 max-w-3xl">
                      {featured.summary}
                    </p>
                    <div className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium link-underline">
                      기사 전문 읽기 <ArrowUpRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </a>
            </article>
          )}

          {/* Rest grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-ink/15">
            {rest.map((n) => (
              <a
                key={n.id}
                href={n.link ?? "#"}
                target="_blank"
                rel="noopener"
                className="group bg-background p-7 md:p-8 hover:bg-ink/[0.02] transition-colors"
                style={{ background: "var(--color-paper)" }}
              >
                <div className="flex items-baseline justify-between mb-5">
                  <span
                    className="inline-flex items-center gap-1 text-[10px] font-bold tracking-[0.18em] px-2 py-1"
                    style={{
                      color: CATEGORY_COLOR[n.category],
                      border: `1px solid ${CATEGORY_COLOR[n.category]}`,
                    }}
                  >
                    {ICONS[n.category]}
                    {CATEGORY_LABEL[n.category]}
                  </span>
                  <span className="text-xs text-muted-foreground tabular-nums">
                    {new Date(n.publishedAt).toLocaleDateString("ko-KR", {
                      month: "2-digit",
                      day: "2-digit",
                    })}
                  </span>
                </div>
                <h3
                  className="text-xl leading-[1.35] transition-colors group-hover:text-[var(--color-brick)] line-clamp-3"
                  style={{
                    color: "var(--color-navy)",
                    fontFamily: "var(--font-serif)",
                    fontWeight: 700,
                  }}
                >
                  {n.title}
                </h3>
                <p className="mt-3 text-sm text-foreground/70 leading-[1.7] line-clamp-3">
                  {n.summary}
                </p>
                <div className="mt-6 flex items-center justify-between text-xs">
                  <span className="font-editorial italic text-muted-foreground">
                    {n.source}
                  </span>
                  <ArrowUpRight className="w-4 h-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
