/**
 * 시민의 목소리 (정책 제안 + 시민 제보)
 * Editorial Civic Design
 * - 상단: 매거진 표지형 인트로
 * - 좌측: 제안 작성 폼 / 우측: 최근 제안 목록
 */
import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { getLoginUrl } from "@/const";
import { toast } from "sonner";
import { ArrowUpRight, MessageSquareText, ShieldCheck } from "lucide-react";

const DISTRICTS = [
  { v: "sujeong", label: "수정구" },
  { v: "jungwon", label: "중원구" },
  { v: "bundang", label: "분당구" },
  { v: "etc", label: "기타·전체" },
] as const;

const CATEGORIES = [
  { v: "welfare", label: "복지·돌봄" },
  { v: "transport", label: "교통·도로" },
  { v: "redev", label: "재개발·재건축" },
  { v: "education", label: "교육·청년" },
  { v: "economy", label: "경제·일자리" },
  { v: "etc", label: "기타" },
] as const;

const STATUS_LABEL: Record<string, { label: string; color: string }> = {
  pending: { label: "접수", color: "var(--color-ink)" },
  reviewing: { label: "검토중", color: "var(--color-navy)" },
  answered: { label: "답변완료", color: "var(--color-brick)" },
};

const CATEGORY_LABEL: Record<string, string> = {
  welfare: "복지·돌봄",
  transport: "교통·도로",
  redev: "재개발·재건축",
  education: "교육·청년",
  economy: "경제·일자리",
  etc: "기타",
};

const DISTRICT_LABEL: Record<string, string> = {
  sujeong: "수정구",
  jungwon: "중원구",
  bundang: "분당구",
  etc: "기타·전체",
};

export default function Voice() {
  const { isAuthenticated, user } = useAuth();
  const utils = trpc.useUtils();

  const proposalsQuery = trpc.proposals.list.useQuery();
  const createMutation = trpc.proposals.create.useMutation({
    onSuccess: () => {
      toast.success("제안이 접수되었습니다", {
        description: "신상진 캠프에서 신중하게 검토하겠습니다.",
      });
      setForm({
        district: "etc",
        category: "etc",
        title: "",
        content: "",
      });
      utils.proposals.list.invalidate();
    },
    onError: (e) => {
      toast.error("제출 실패", { description: e.message });
    },
  });

  const [form, setForm] = useState<{
    district: (typeof DISTRICTS)[number]["v"];
    category: (typeof CATEGORIES)[number]["v"];
    title: string;
    content: string;
  }>({
    district: "etc",
    category: "etc",
    title: "",
    content: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast("로그인이 필요합니다", {
        description: "본인 확인 후 제안을 등록할 수 있습니다.",
        action: {
          label: "로그인",
          onClick: () => (window.location.href = getLoginUrl()),
        },
      });
      return;
    }
    if (form.title.trim().length < 2 || form.content.trim().length < 10) {
      toast.error("내용을 조금 더 채워주세요", {
        description: "제목 2자 이상 / 내용 10자 이상 입력 부탁드립니다.",
      });
      return;
    }
    createMutation.mutate(form);
  };

  return (
    <div className="paper-texture">
      {/* ============== HERO ============== */}
      <section className="border-b border-ink/15">
        <div className="container py-20 md:py-28">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-end">
            <div className="lg:col-span-8">
              <div className="chapter-label">Citizen · Voice</div>
              <h1
                className="mt-6 text-[clamp(2.5rem,6vw,4.75rem)] leading-[1.05]"
                style={{ color: "var(--color-navy)" }}
              >
                시민의 목소리,
                <br />
                <span style={{ color: "var(--color-brick)" }}>정책</span>이 됩니다.
              </h1>
              <p className="mt-6 max-w-xl text-[17px] leading-[1.8] text-foreground/80">
                작은 불편, 큰 제안 모두 환영합니다. 시민이 보낸 모든 의견은
                신상진 캠프 정책팀이 직접 검토하여 답변과 공약 반영을 약속드립니다.
              </p>
            </div>
            <div className="lg:col-span-4">
              <div className="border-t border-ink/30 pt-6">
                <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted-foreground">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>How it works</span>
                </div>
                <ol className="mt-4 space-y-3 text-sm text-foreground/80 leading-relaxed">
                  <li>
                    <strong>01.</strong> 본인 확인을 위해 한 번만 로그인합니다.
                  </li>
                  <li>
                    <strong>02.</strong> 지역구·카테고리를 선택하고 제안을 작성합니다.
                  </li>
                  <li>
                    <strong>03.</strong> 정책팀이 검토 후 답변·공약 반영을 진행합니다.
                  </li>
                </ol>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============== FORM + LIST ============== */}
      <section>
        <div className="container py-20 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          {/* ===== Form ===== */}
          <div className="lg:col-span-5">
            <div className="chapter-label">Submit a Proposal</div>
            <h2
              className="mt-3 text-3xl md:text-4xl"
              style={{ color: "var(--color-navy)" }}
            >
              새 제안 작성
            </h2>

            <form onSubmit={handleSubmit} className="mt-10 space-y-7">
              {/* District */}
              <div>
                <label className="block text-xs tracking-[0.18em] uppercase text-muted-foreground font-semibold mb-3">
                  지역구
                </label>
                <div className="flex flex-wrap gap-2">
                  {DISTRICTS.map((d) => {
                    const active = form.district === d.v;
                    return (
                      <button
                        key={d.v}
                        type="button"
                        onClick={() => setForm((f) => ({ ...f, district: d.v }))}
                        className="px-4 py-2 text-sm font-medium transition-all"
                        style={{
                          background: active
                            ? "var(--color-navy)"
                            : "transparent",
                          color: active
                            ? "var(--color-paper)"
                            : "var(--color-ink)",
                          border: `1px solid ${
                            active ? "var(--color-navy)" : "rgba(0,0,0,0.2)"
                          }`,
                        }}
                      >
                        {d.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Category */}
              <div>
                <label className="block text-xs tracking-[0.18em] uppercase text-muted-foreground font-semibold mb-3">
                  카테고리
                </label>
                <div className="flex flex-wrap gap-2">
                  {CATEGORIES.map((c) => {
                    const active = form.category === c.v;
                    return (
                      <button
                        key={c.v}
                        type="button"
                        onClick={() => setForm((f) => ({ ...f, category: c.v }))}
                        className="px-4 py-2 text-sm font-medium transition-all"
                        style={{
                          background: active
                            ? "var(--color-brick)"
                            : "transparent",
                          color: active
                            ? "var(--color-paper)"
                            : "var(--color-ink)",
                          border: `1px solid ${
                            active ? "var(--color-brick)" : "rgba(0,0,0,0.2)"
                          }`,
                        }}
                      >
                        {c.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Title */}
              <div>
                <label className="block text-xs tracking-[0.18em] uppercase text-muted-foreground font-semibold mb-3">
                  제목
                </label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, title: e.target.value }))
                  }
                  placeholder="예) 야탑역 출퇴근 혼잡 완화 방안"
                  className="w-full bg-transparent border-0 border-b-2 border-ink/30 py-3 text-base focus:outline-none focus:border-[var(--color-navy)] transition-colors"
                  style={{ fontFamily: "var(--font-serif)" }}
                  maxLength={200}
                />
              </div>

              {/* Content */}
              <div>
                <label className="block text-xs tracking-[0.18em] uppercase text-muted-foreground font-semibold mb-3">
                  내용
                </label>
                <textarea
                  value={form.content}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, content: e.target.value }))
                  }
                  placeholder="시민이 직접 겪은 일, 바라는 변화, 구체적인 아이디어를 자유롭게 적어주세요."
                  rows={7}
                  maxLength={2000}
                  className="w-full bg-transparent border border-ink/20 p-4 text-[15px] leading-[1.7] focus:outline-none focus:border-[var(--color-navy)] transition-colors resize-y"
                />
                <div className="mt-1 text-right text-xs text-muted-foreground tabular-nums">
                  {form.content.length} / 2000
                </div>
              </div>

              {/* Submit */}
              <div className="flex items-center gap-4 pt-2">
                <button
                  type="submit"
                  disabled={createMutation.isPending}
                  className="inline-flex items-center gap-2 px-7 py-3.5 text-[15px] font-semibold tracking-wide transition-all hover:translate-y-[-1px] disabled:opacity-60"
                  style={{
                    background: "var(--color-navy)",
                    color: "var(--color-paper)",
                    letterSpacing: "0.04em",
                  }}
                >
                  {createMutation.isPending ? "전송 중..." : "제안 보내기"}
                  <ArrowUpRight className="w-4 h-4" />
                </button>
                {!isAuthenticated && (
                  <span className="text-xs text-muted-foreground font-editorial italic">
                    * 로그인 후 제출 가능합니다
                  </span>
                )}
                {isAuthenticated && user?.name && (
                  <span className="text-xs text-muted-foreground font-editorial italic">
                    * {user.name} 님으로 제출
                  </span>
                )}
              </div>
            </form>
          </div>

          {/* ===== List ===== */}
          <div className="lg:col-span-7">
            <div className="flex items-baseline justify-between border-b border-ink/30 pb-3 mb-6">
              <div className="chapter-label">Recent Voices</div>
              <div className="text-xs text-muted-foreground tabular-nums font-editorial italic">
                {proposalsQuery.data?.length ?? 0} 건
              </div>
            </div>

            {proposalsQuery.isLoading && (
              <div className="text-sm text-muted-foreground py-12 text-center">
                불러오는 중...
              </div>
            )}

            {!proposalsQuery.isLoading &&
              (proposalsQuery.data?.length ?? 0) === 0 && (
                <div className="border border-dashed border-ink/20 py-16 text-center">
                  <MessageSquareText className="w-7 h-7 mx-auto text-muted-foreground" />
                  <p className="mt-4 text-sm text-foreground/70">
                    아직 등록된 제안이 없습니다.
                    <br />첫 번째 시민의 목소리가 되어주세요.
                  </p>
                </div>
              )}

            <ul className="divide-y divide-ink/15">
              {proposalsQuery.data?.map((p) => (
                <li key={p.id} className="py-6 group">
                  <div className="flex items-baseline gap-2 flex-wrap">
                    <span
                      className="text-[10px] font-bold tracking-[0.18em] px-2 py-1"
                      style={{
                        color: STATUS_LABEL[p.status]?.color,
                        border: `1px solid ${STATUS_LABEL[p.status]?.color}`,
                      }}
                    >
                      {STATUS_LABEL[p.status]?.label}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {DISTRICT_LABEL[p.district]} · {CATEGORY_LABEL[p.category]}
                    </span>
                    <span className="text-xs text-muted-foreground ml-auto tabular-nums font-editorial italic">
                      {new Date(p.createdAt).toLocaleDateString("ko-KR")}
                    </span>
                  </div>
                  <h3
                    className="mt-3 text-xl md:text-2xl transition-colors group-hover:text-[var(--color-brick)]"
                    style={{
                      color: "var(--color-navy)",
                      fontFamily: "var(--font-serif)",
                      fontWeight: 700,
                    }}
                  >
                    {p.title}
                  </h3>
                  <p className="mt-2 text-[15px] leading-[1.7] text-foreground/75 line-clamp-3">
                    {p.content}
                  </p>
                  <div className="mt-3 text-xs text-muted-foreground font-editorial italic">
                    — {p.authorName}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
