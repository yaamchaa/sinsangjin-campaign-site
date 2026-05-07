/**
 * 시민의 목소리
 * - 시민 제안 등록
 * - 공개된 제안 목록 조회
 * - 관리자 답변(answer) 노출
 */
import { useEffect, useMemo, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
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

type DistrictValue = (typeof DISTRICTS)[number]["v"];
type CategoryValue = (typeof CATEGORIES)[number]["v"];

type VoiceItem = {
  id: string;
  user_id: string | null;
  district: string;
  category: string;
  title: string;
  content: string;
  status: string;
  author_name: string | null;
  author_email: string | null;
  answer: string | null;
  answered_by: string | null;
  answered_at: string | null;
  source: string | null;
  external_id: string | null;
  published: boolean | null;
  is_private: boolean | null;
  created_at: string;
  updated_at: string | null;
};

type FormState = {
  district: DistrictValue;
  category: CategoryValue;
  title: string;
  content: string;
};

function getDisplayName(user: User | null): string {
  if (!user) return "";
  const metadata = user.user_metadata as Record<string, unknown> | undefined;
  const nameFromMetadata = metadata?.name;
  if (typeof nameFromMetadata === "string" && nameFromMetadata.trim()) {
    return nameFromMetadata.trim();
  }
  if (user.email) return user.email;
  return "시민";
}

export default function Voice() {
  const [authUser, setAuthUser] = useState<User | null>(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [items, setItems] = useState<VoiceItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [form, setForm] = useState<FormState>({
    district: "etc",
    category: "etc",
    title: "",
    content: "",
  });

  const isAuthenticated = useMemo(() => Boolean(authUser), [authUser]);

  useEffect(() => {
    let mounted = true;

    async function initialize() {
      await Promise.all([checkCurrentUser(mounted), loadVoices(mounted)]);
    }

    void initialize();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!mounted) return;
      setAuthUser(session?.user ?? null);
      setAuthChecked(true);
    });

    const channel = supabase
      .channel("voice-messages-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "voice_messages" },
        async () => {
          await loadVoices(mounted);
        }
      )
      .subscribe();

    return () => {
      mounted = false;
      subscription.unsubscribe();
      void supabase.removeChannel(channel);
    };
  }, []);

  async function checkCurrentUser(mounted = true) {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!mounted) return;
    setAuthUser(user ?? null);
    setAuthChecked(true);
  }

  async function loadVoices(mounted = true) {
    setLoading(true);

    const { data, error } = await supabase
      .from("voice_messages")
      .select("*")
      .eq("published", true)
      .order("created_at", { ascending: false })
      .limit(100);

    if (!mounted) return;

    if (error) {
      toast.error("시민의 목소리를 불러오지 못했습니다", {
        description: error.message,
      });
      setItems([]);
      setLoading(false);
      return;
    }

    setItems(((data ?? []) as VoiceItem[]).filter(Boolean));
    setLoading(false);
  }

  function resetForm() {
    setForm({
      district: "etc",
      category: "etc",
      title: "",
      content: "",
    });
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!authChecked) {
      toast("로그인 상태를 확인 중입니다", {
        description: "잠시 후 다시 시도해 주세요.",
      });
      return;
    }

    if (!isAuthenticated) {
  toast("로그인이 필요합니다", {
    description: "우측 로그인 버튼을 눌러 본인 확인 후 제안을 등록해 주세요.",
  });
  return;
}

    const trimmedTitle = form.title.trim();
    const trimmedContent = form.content.trim();

    if (trimmedTitle.length < 2 || trimmedContent.length < 10) {
      toast.error("내용을 조금 더 채워주세요", {
        description: "제목 2자 이상 / 내용 10자 이상 입력 부탁드립니다.",
      });
      return;
    }

    setSubmitting(true);

    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError) throw userError;

      if (!user) {
  toast.error("로그인 정보가 확인되지 않았습니다", {
    description: "우측 로그인 버튼을 눌러 다시 로그인해 주세요.",
  });
  setSubmitting(false);
  return;
}

      const authorName = getDisplayName(user);
      const authorEmail = user.email ?? null;

      const payload = {
        user_id: user.id,
        district: form.district,
        category: form.category,
        title: trimmedTitle,
        content: trimmedContent,
        status: "pending",
        author_name: authorName || "익명 시민",
        author_email: authorEmail,
        source: "citizen",
        published: false,
        is_private: true,
      };

      const { error } = await supabase
        .from("voice_messages")
        .insert([payload])        

      if (error) throw error;

      toast.success("제안이 접수되었습니다", {
        description: "검토 후 공개 및 답변이 진행됩니다.",
      });

      resetForm();
    } catch (error: any) {
      toast.error("제출 실패", {
        description: error?.message || "제안 저장 중 오류가 발생했습니다.",
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="paper-texture">
      <section className="border-b border-ink/15">
        <div className="container py-20 md:py-28">
          <div className="grid grid-cols-1 items-end gap-10 lg:grid-cols-12">
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
                신상진 캠프 정책팀이 직접 검토하여 답변과 공약 반영을 진행합니다.
              </p>
            </div>

            <div className="lg:col-span-4">
              <div className="border-t border-ink/30 pt-6">
                <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted-foreground">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  <span>How it works</span>
                </div>
                <ol className="mt-4 space-y-3 text-sm leading-relaxed text-foreground/80">
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

      <section>
        <div className="container grid grid-cols-1 gap-12 py-20 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <div className="chapter-label">Submit a Proposal</div>
            <h2 className="mt-3 text-3xl md:text-4xl" style={{ color: "var(--color-navy)" }}>
              새 제안 작성
            </h2>

            <form onSubmit={handleSubmit} className="mt-10 space-y-7">
              <div>
                <label className="mb-3 block text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  지역구
                </label>
                <div className="flex flex-wrap gap-2">
                  {DISTRICTS.map((district) => {
                    const active = form.district === district.v;
                    return (
                      <button
                        key={district.v}
                        type="button"
                        onClick={() =>
                          setForm((prev) => ({ ...prev, district: district.v }))
                        }
                        className="px-4 py-2 text-sm font-medium transition-all"
                        style={{
                          background: active ? "var(--color-navy)" : "transparent",
                          color: active ? "var(--color-paper)" : "var(--color-ink)",
                          border:
                            "1px solid " +
                            (active ? "var(--color-navy)" : "rgba(0,0,0,0.2)"),
                        }}
                      >
                        {district.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="mb-3 block text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  카테고리
                </label>
                <div className="flex flex-wrap gap-2">
                  {CATEGORIES.map((category) => {
                    const active = form.category === category.v;
                    return (
                      <button
                        key={category.v}
                        type="button"
                        onClick={() =>
                          setForm((prev) => ({ ...prev, category: category.v }))
                        }
                        className="px-4 py-2 text-sm font-medium transition-all"
                        style={{
                          background: active ? "var(--color-brick)" : "transparent",
                          color: active ? "var(--color-paper)" : "var(--color-ink)",
                          border:
                            "1px solid " +
                            (active ? "var(--color-brick)" : "rgba(0,0,0,0.2)"),
                        }}
                      >
                        {category.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="mb-3 block text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  제목
                </label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, title: e.target.value }))
                  }
                  placeholder="예) 야탑역 출퇴근 혼잡 완화 방안"
                  className="w-full border-0 border-b-2 border-ink/30 bg-transparent py-3 text-base transition-colors focus:border-[var(--color-navy)] focus:outline-none"
                  style={{ fontFamily: "var(--font-serif)" }}
                  maxLength={200}
                />
              </div>

              <div>
                <label className="mb-3 block text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  내용
                </label>
                <textarea
                  value={form.content}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, content: e.target.value }))
                  }
                  placeholder="시민이 직접 겪은 일, 바라는 변화, 구체적인 아이디어를 자유롭게 적어주세요."
                  rows={7}
                  maxLength={2000}
                  className="w-full resize-y border border-ink/20 bg-transparent p-4 text-[15px] leading-[1.7] transition-colors focus:border-[var(--color-navy)] focus:outline-none"
                />
                <div className="mt-1 text-right text-xs tabular-nums text-muted-foreground">
                  {form.content.length} / 2000
                </div>
              </div>

              <div className="rounded-md border border-ink/15 bg-black/5 p-4 text-sm leading-[1.7] text-foreground/75">
                접수된 제안은 검토 후 공개 여부가 결정되며, 개인정보나 민감한 내용이 포함된 경우
                비공개로 관리될 수 있습니다.
              </div>

              <div className="flex flex-wrap items-center gap-4 pt-2">
  <button
    type="submit"
    disabled={submitting}
    className="inline-flex items-center gap-2 px-7 py-3.5 text-[15px] font-semibold tracking-wide transition-all hover:translate-y-[-1px] disabled:opacity-60"
    style={{
      background: "var(--color-navy)",
      color: "var(--color-paper)",
      letterSpacing: "0.04em",
    }}
  >
    {submitting ? "전송 중..." : "제안 내기"}
    <ArrowUpRight className="h-4 w-4" />
  </button>

  <button
    type="button"
    onClick={() => {
      window.location.href =
        "https://yaamchaa.github.io/sinsangjin-campaign-site/#/sinsangjin-campaign-site/user-login?returnTo=%2Fsinsangjin-campaign-site%2Fvoice";
    }}
    className="inline-flex items-center rounded-md border px-5 py-3 text-sm font-semibold transition-all"
    style={{
      borderColor: "var(--color-navy)",
      color: "var(--color-navy)",
      background: "transparent",
    }}
  >
    로그인
  </button>

  <span className="font-editorial text-xs italic text-muted-foreground">
    * 로그인 후 제출 가능합니다
  </span>
</div>

  {isAuthenticated && (
    <span className="font-editorial text-xs italic text-muted-foreground">
      * {getDisplayName(authUser)} 님으로 제출
    </span>
  )}
</div>

          <div className="lg:col-span-7">
            <div className="mb-6 flex items-baseline justify-between border-b border-ink/30 pb-3">
              <div className="chapter-label">Recent Voices</div>
              <div className="font-editorial text-xs italic tabular-nums text-muted-foreground">
                {items.length} 건
              </div>
            </div>

            {loading && (
              <div className="py-12 text-center text-sm text-muted-foreground">
                불러오는 중...
              </div>
            )}

            {!loading && items.length === 0 && (
              <div className="border border-dashed border-ink/20 py-16 text-center">
                <MessageSquareText className="mx-auto h-7 w-7 text-muted-foreground" />
                <p className="mt-4 text-sm text-foreground/70">
                  아직 공개된 제안이 없습니다.
                  <br />
                  첫 번째 시민의 목소리를 남겨주세요.
                </p>
              </div>
            )}

            {!loading && items.length > 0 && (
              <ul className="divide-y divide-ink/15">
                {items.map((item) => {
                  const statusInfo = STATUS_LABEL[item.status] ?? {
                    label: item.status,
                    color: "var(--color-ink)",
                  };

                  const statusStyle = {
                    color: statusInfo.color,
                    border: "1px solid " + statusInfo.color,
                  };

                  const answeredDate = item.answered_at
                    ? new Date(item.answered_at).toLocaleDateString("ko-KR")
                    : "";

                  return (
                    <li key={item.id} className="group py-6">
                      <div className="flex flex-wrap items-baseline gap-2">
                        <span
                          className="px-2 py-1 text-[10px] font-bold tracking-[0.18em]"
                          style={statusStyle}
                        >
                          {statusInfo.label}
                        </span>

                        <span className="text-xs text-muted-foreground">
                          {DISTRICT_LABEL[item.district] ?? item.district} ·{" "}
                          {CATEGORY_LABEL[item.category] ?? item.category}
                        </span>

                        <span className="ml-auto font-editorial text-xs italic tabular-nums text-muted-foreground">
                          {new Date(item.created_at).toLocaleDateString("ko-KR")}
                        </span>
                      </div>

                      <h3
                        className="mt-3 break-words text-xl transition-colors group-hover:text-[var(--color-brick)] md:text-2xl"
                        style={{
                          color: "var(--color-navy)",
                          fontFamily: "var(--font-serif)",
                          fontWeight: 700,
                        }}
                      >
                        {item.title}
                      </h3>

                      <p
                        className="mt-2 min-w-0 whitespace-pre-wrap break-words text-[15px] leading-[1.7] text-foreground/75"
                        style={{ overflowWrap: "anywhere", wordBreak: "break-word" }}
                      >
                          {item.content}
                      </p>

                      <div className="mt-3 font-editorial text-xs italic text-muted-foreground">
                        — {item.author_name || "익명 시민"}
                      </div>

                          {item.answer && (
                      <div className="mt-5 overflow-hidden rounded-lg border border-ink/15 bg-white/70 p-4">
                       <div className="text-xs uppercase tracking-[0.16em] text-muted-foreground">
                         캠프 답변
                         </div>
                       <p
                         className="mt-2 whitespace-pre-wrap break-words text-sm leading-[1.8] text-foreground/80"
                         style={{ overflowWrap: "anywhere", wordBreak: "break-word" }}
                       >
                          {item.answer}
                       </p>
                         <div className="mt-3 text-xs text-muted-foreground">
                          {item.answered_by || "관리자"}
                           {answeredDate ? ` · ${answeredDate}` : ""}
                        </div>
                       </div>
                       )}
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
