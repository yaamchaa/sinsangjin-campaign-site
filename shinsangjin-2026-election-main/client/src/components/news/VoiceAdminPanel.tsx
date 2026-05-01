import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

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

const STATUS_OPTIONS = [
  { v: "pending", label: "접수" },
  { v: "reviewing", label: "검토중" },
  { v: "answered", label: "답변완료" },
];

const STATUS_LABEL: Record<string, string> = {
  pending: "접수",
  reviewing: "검토중",
  answered: "답변완료",
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

export default function VoiceAdminPanel() {
  const [items, setItems] = useState<VoiceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "pending" | "reviewing" | "answered">("all");

  useEffect(() => {
    void loadItems();
  }, []);

  async function loadItems() {
    setLoading(true);

    const { data, error } = await supabase
      .from("voice_messages")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(200);

    if (error) {
      toast.error("시민목소리를 불러오지 못했습니다", {
        description: error.message,
      });
      setItems([]);
      setLoading(false);
      return;
    }

    setItems(((data ?? []) as VoiceItem[]).filter(Boolean));
    setLoading(false);
  }

  const filteredItems = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    return items.filter((item) => {
      const matchesStatus = filterStatus === "all" ? true : item.status === filterStatus;
      const text = [
        item.title,
        item.content,
        item.author_name,
        item.author_email,
        item.answer,
        item.district,
        item.category,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      const matchesSearch = keyword ? text.includes(keyword) : true;
      return matchesStatus && matchesSearch;
    });
  }, [items, search, filterStatus]);

  async function updateItem(item: VoiceItem, patch: Partial<VoiceItem>) {
    setSavingId(item.id);

    const nextStatus = patch.status ?? item.status;
    const nextAnswer = patch.answer ?? item.answer ?? "";

    const payload: Record<string, unknown> = {
      status: nextStatus,
      published: patch.published ?? item.published ?? false,
      is_private: patch.is_private ?? item.is_private ?? true,
      answer: nextAnswer,
      updated_at: new Date().toISOString(),
    };

    if (nextStatus === "answered") {
      payload.answered_at = item.answered_at ?? new Date().toISOString();
    }

    const { data: userResult } = await supabase.auth.getUser();
    const email = userResult.user?.email ?? "";
    if (email) payload.answered_by = email;

    const { error } = await supabase
      .from("voice_messages")
      .update(payload)
      .eq("id", item.id);

    if (error) {
      toast.error("저장 실패", {
        description: error.message,
      });
      setSavingId(null);
      return;
    }

    toast.success("저장되었습니다");
    await loadItems();
    setSavingId(null);
  }

  async function handleDelete(item: VoiceItem) {
    const ok = window.confirm("이 시민목소리를 삭제할까요?");
    if (!ok) return;

    setSavingId(item.id);

    const { error } = await supabase
      .from("voice_messages")
      .delete()
      .eq("id", item.id);

    if (error) {
      toast.error("삭제 실패", {
        description: error.message,
      });
      setSavingId(null);
      return;
    }

    toast.success("삭제되었습니다");
    await loadItems();
    setSavingId(null);
  }

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-ink/15 bg-white/70 p-5 md:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="chapter-label">Admin · Citizen Voice</div>
            <h2 className="mt-3 text-2xl font-semibold" style={{ color: "var(--color-navy)" }}>
              시민목소리 관리
            </h2>
            <p className="mt-2 text-sm leading-[1.8] text-muted-foreground">
              시민 제안을 검토하고, 답변을 달고, 공개 여부를 관리합니다.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="제목, 작성자, 내용 검색"
              className="w-full rounded-md border border-ink/15 bg-white px-4 py-2 text-sm outline-none sm:w-72"
            />

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as typeof filterStatus)}
              className="rounded-md border border-ink/15 bg-white px-4 py-2 text-sm outline-none"
            >
              <option value="all">전체 상태</option>
              <option value="pending">접수</option>
              <option value="reviewing">검토중</option>
              <option value="answered">답변완료</option>
            </select>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="rounded-xl border border-ink/15 bg-white/70 p-8 text-sm text-muted-foreground">
          시민목소리를 불러오는 중...
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="rounded-xl border border-dashed border-ink/20 bg-white/70 p-10 text-center">
          <p className="text-sm text-muted-foreground">조건에 맞는 시민목소리가 없습니다.</p>
        </div>
      ) : (
        <div className="space-y-5">
          {filteredItems.map((item) => (
            <article key={item.id} className="rounded-xl border border-ink/15 bg-white/70 p-5 md:p-6">
              <div className="flex flex-wrap items-start gap-3">
                <span className="rounded-full border border-ink/15 px-3 py-1 text-xs font-semibold">
                  {STATUS_LABEL[item.status] ?? item.status}
                </span>
                <span className="text-xs text-muted-foreground">
                  {DISTRICT_LABEL[item.district] ?? item.district} ·{" "}
                  {CATEGORY_LABEL[item.category] ?? item.category}
                </span>
                <span className="ml-auto text-xs text-muted-foreground">
                  {new Date(item.created_at).toLocaleDateString("ko-KR")}
                </span>
              </div>

              <h3 className="mt-4 text-xl font-semibold" style={{ color: "var(--color-navy)" }}>
                {item.title}
              </h3>

              <div className="mt-2 text-sm text-muted-foreground">
                작성자: {item.author_name || "익명 시민"}
                {item.author_email ? ` · ${item.author_email}` : ""}
              </div>

              <p
                className="mt-4 whitespace-pre-wrap text-sm leading-[1.8] text-foreground/85"
                style={{ overflowWrap: "anywhere", wordBreak: "break-word" }}
              >
                {item.content}
              </p>

              <div className="mt-5 grid gap-4 lg:grid-cols-2">
                <div>
                  <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                    상태
                  </label>
                  <select
                    value={item.status}
                    onChange={(e) => updateItem(item, { status: e.target.value })}
                    className="w-full rounded-md border border-ink/15 bg-white px-3 py-2 text-sm outline-none"
                    disabled={savingId === item.id}
                  >
                    {STATUS_OPTIONS.map((opt) => (
                      <option key={opt.v} value={opt.v}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-end gap-3">
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={Boolean(item.published)}
                      onChange={(e) =>
                        updateItem(item, {
                          published: e.target.checked,
                        })
                      }
                      disabled={savingId === item.id}
                    />
                    공개
                  </label>

                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={!item.is_private}
                      onChange={(e) =>
                        updateItem(item, {
                          is_private: !e.target.checked,
                        })
                      }
                      disabled={savingId === item.id}
                    />
                    비공개 해제
                  </label>
                </div>
              </div>

              <div className="mt-5">
                <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                  관리자 답변
                </label>
                <textarea
                  value={item.answer ?? ""}
                  onChange={(e) => {
                    const value = e.target.value;
                    setItems((prev) =>
                      prev.map((row) =>
                        row.id === item.id ? { ...row, answer: value } : row
                      )
                    );
                  }}
                  rows={6}
                  placeholder="답변 내용을 입력하세요."
                  className="w-full rounded-md border border-ink/15 bg-white p-3 text-sm leading-[1.8] outline-none"
                  style={{ overflowWrap: "anywhere", wordBreak: "break-word" }}
                  disabled={savingId === item.id}
                />
              </div>

              <div className="mt-4 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() =>
                    updateItem(item, {
                      answer: item.answer ?? "",
                      status: item.answer?.trim() ? "answered" : item.status,
                      published: true,
                      is_private: false,
                    })
                  }
                  disabled={savingId === item.id}
                  className="rounded-md px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
                  style={{ background: "var(--color-navy)" }}
                >
                  {savingId === item.id ? "저장 중..." : "저장"}
                </button>

                <button
                  type="button"
                  onClick={() => handleDelete(item)}
                  disabled={savingId === item.id}
                  className="rounded-md border border-ink/15 px-4 py-2 text-sm font-semibold disabled:opacity-60"
                >
                  삭제
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}