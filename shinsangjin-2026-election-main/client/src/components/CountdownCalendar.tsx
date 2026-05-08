/**
 * Countdown + 선거 일정 캘린더
 * Editorial Civic Design — 신문 인덱스 스타일
 * - 좌측: 6월 3일까지 D-카운트다운
 * - 우측: 주요 선거·유세·공약 발표 일정
 */
import { useEffect, useMemo, useState } from "react";
import { Calendar, Clock } from "lucide-react";

const ELECTION_DATE = new Date("2026-06-03T06:00:00+09:00");

type ScheduleItem = {
  date: string; // YYYY-MM-DD
  label: string;
  category: "official" | "campaign" | "policy" | "vote";
  description: string;
};

const SCHEDULE: ScheduleItem[] = [
  {
    date: "2026-05-14",
    label: "후보자 등록 시작",
    category: "official",
    description: "성남시장 후보 등록 기간 (5/14~5/15)",
  },
  {
    date: "2026-05-21",
    label: "공식 선거운동 개시",
    category: "campaign",
    description: "21일간의 본선 캠페인 출발",
  },
  {
    date: "2026-05-23",
    label: "분당구 정책 발표회",
    category: "policy",
    description: "재건축 선도지구 추진 로드맵 공개",
  },
  {
    date: "2026-05-26",
    label: "수정·중원 원도심 비전 선포",
    category: "policy",
    description: "재개발 5개 구역 일정·교통망 확충 계획",
  },
  {
    date: "2026-05-29",
    label: "TV 후보자 토론회",
    category: "campaign",
    description: "성남시선거방송토론위원회 주관",
  },
  {
    date: "2026-05-30",
    label: "사전투표 (1일차)",
    category: "vote",
    description: "전국 사전투표소 06:00–18:00",
  },
  {
    date: "2026-05-31",
    label: "사전투표 (2일차)",
    category: "vote",
    description: "전국 사전투표소 06:00–18:00",
  },
  {
    date: "2026-06-03",
    label: "선거일 · 본투표",
    category: "vote",
    description: "제9회 전국동시지방선거 06:00–18:00",
  },
];

const CATEGORY_META: Record<ScheduleItem["category"], { label: string; color: string }> = {
  official: { label: "OFFICIAL", color: "var(--color-ink)" },
  campaign: { label: "CAMPAIGN", color: "var(--color-navy)" },
  policy: { label: "POLICY", color: "var(--color-brick)" },
  vote: { label: "VOTE", color: "var(--color-gold)" },
};

function useCountdown(target: Date) {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return useMemo(() => {
    const diff = target.getTime() - now.getTime();
    const total = Math.max(0, diff);
    const days = Math.floor(total / (1000 * 60 * 60 * 24));
    const hours = Math.floor((total / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((total / (1000 * 60)) % 60);
    const seconds = Math.floor((total / 1000) % 60);
    return { days, hours, minutes, seconds, ended: diff <= 0 };
  }, [now, target]);
}

function formatKoreanDate(iso: string) {
  const d = new Date(iso);
  const m = d.getMonth() + 1;
  const day = d.getDate();
  const week = ["일", "월", "화", "수", "목", "금", "토"][d.getDay()];
  return { m, day, week };
}

export default function CountdownCalendar() {
  const { days, hours, minutes, seconds, ended } = useCountdown(ELECTION_DATE);

  return (
    <section
      className="border-b border-ink/15"
      style={{ background: "var(--color-paper)" }}
    >
      <div className="container py-16 md:py-20">
        {/* Section header — newspaper masthead style */}
        <div className="flex items-baseline justify-between gap-4 border-b border-ink/30 pb-3 mb-10">
          <div className="chapter-label">Election Calendar · 2026.06.03</div>
          <div className="font-editorial italic text-xs text-muted-foreground hidden sm:block">
            제9회 전국동시지방선거
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          {/* ===================== LEFT — Countdown ===================== */}
          <div className="lg:col-span-5">
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted-foreground">
              <Clock className="w-3.5 h-3.5" />
              <span>Time Remaining</span>
            </div>
            <h2
              className="mt-3 text-3xl md:text-4xl leading-tight"
              style={{ color: "var(--color-navy)" }}
            >
              선거일까지
              <br />
              <span style={{ color: "var(--color-brick)" }}>
                {ended ? "마감되었습니다" : "남은 시간"}
              </span>
            </h2>

            {/* D-Count tiles */}
            <div className="mt-8 grid grid-cols-4 gap-px bg-ink/20">
              {[
                { v: days, l: "DAYS" },
                { v: hours, l: "HRS" },
                { v: minutes, l: "MIN" },
                { v: seconds, l: "SEC" },
              ].map((t) => (
                <div
                  key={t.l}
                  className="bg-background py-5 px-3 text-center"
                  style={{ background: "var(--color-paper)" }}
                >
                  <div
                    className="text-[clamp(1.75rem,4vw,2.5rem)] font-black tabular-nums leading-none"
                    style={{
                      color: "var(--color-navy)",
                      fontFamily: "var(--font-serif)",
                    }}
                  >
                    {String(t.v).padStart(2, "0")}
                  </div>
                  <div className="mt-2 text-[10px] tracking-[0.2em] text-muted-foreground font-semibold">
                    {t.l}
                  </div>
                </div>
              ))}
            </div>

            <p className="mt-6 text-sm text-foreground/75 leading-[1.7] max-w-md">
              2026년 6월 3일, 시민 한 분의 한 표가 성남의 다음 4년을 결정합니다.
              잊지 마시고 꼭 투표해 주세요.
            </p>

            <div className="mt-6 inline-flex items-center gap-2 text-xs font-editorial italic text-muted-foreground">
              <Calendar className="w-3.5 h-3.5" />
              <span>본투표 06:00 – 18:00 · 사전투표 5/30 – 5/31</span>
            </div>
          </div>

          {/* ===================== RIGHT — Schedule list ===================== */}
          <div className="lg:col-span-7">
            <div className="flex items-baseline justify-between mb-6">
              <div className="chapter-label">Key Dates</div>
              <div className="text-xs text-muted-foreground font-editorial italic">
                {SCHEDULE.length} entries
              </div>
            </div>

            <ul className="divide-y divide-ink/15">
              {SCHEDULE.map((item) => {
                const { m, day, week } = formatKoreanDate(item.date);
                const meta = CATEGORY_META[item.category];
                const isElectionDay = item.date === "2026-06-03";
                return (
                  <li
                    key={item.date + item.label}
                    className="grid grid-cols-12 gap-4 py-5 group"
                  >
                    {/* Date column */}
                    <div className="col-span-3 sm:col-span-2 flex items-baseline gap-1.5">
                      <span
                        className="text-2xl md:text-3xl font-black tabular-nums leading-none"
                        style={{
                          fontFamily: "var(--font-serif)",
                          color: isElectionDay
                            ? "var(--color-brick)"
                            : "var(--color-navy)",
                        }}
                      >
                        {String(m).padStart(2, "0")}.{String(day).padStart(2, "0")}
                      </span>
                      <span className="text-xs text-muted-foreground">({week})</span>
                    </div>
                    {/* Category */}
                    <div className="col-span-3 sm:col-span-2 flex items-center">
                      <span
                        className="text-[10px] font-bold tracking-[0.18em] px-2 py-1"
                        style={{
                          color: meta.color,
                          border: `1px solid ${meta.color}`,
                          background: "transparent",
                        }}
                      >
                        {meta.label}
                      </span>
                    </div>
                    {/* Title + desc */}
                    <div className="col-span-12 sm:col-span-8">
                      <div
                        className="text-base md:text-lg font-semibold transition-colors group-hover:text-[var(--color-brick)]"
                        style={{ color: "var(--color-navy)" }}
                      >
                        {item.label}
                      </div>
                      <div className="mt-1 text-sm text-foreground/70 leading-relaxed">
                        {item.description}
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
