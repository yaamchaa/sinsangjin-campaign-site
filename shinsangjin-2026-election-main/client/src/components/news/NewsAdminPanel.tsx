import { useEffect, useState } from "react";
import {
  createNews,
  deleteNews,
  getAdminNews,
  updateNews,
  type NewsItem,
} from "@/lib/news";

const CATEGORY_OPTIONS = [
  { value: "press", label: "보도자료" },
  { value: "interview", label: "인터뷰" },
  { value: "media", label: "언론 기사" },
  { value: "video", label: "영상" },
] as const;

function formatDate(dateStr?: string | null) {
  if (!dateStr) return "-";
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return "-";
  return d.toLocaleString("ko-KR");
}

export default function NewsAdminPanel() {
  const [items, setItems] = useState<NewsItem[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [link, setLink] = useState("");
  const [source, setSource] = useState("");
  const [category, setCategory] = useState<
    "press" | "interview" | "media" | "video"
  >("press");
  const [status, setStatus] = useState<"published" | "draft">("published");
  const [publishedAt, setPublishedAt] = useState("");
  const [loading, setLoading] = useState(false);
  const [listLoading, setListLoading] = useState(true);
  const [errorText, setErrorText] = useState("");
  const [successText, setSuccessText] = useState("");

  useEffect(() => {
    void loadNews();
  }, []);

  async function loadNews() {
    setListLoading(true);
    setErrorText("");

    const { data, error } = await getAdminNews(100);

    if (error) {
      setErrorText(error.message);
      setItems([]);
      setListLoading(false);
      return;
    }

    setItems(data ?? []);
    setListLoading(false);
  }

  function resetForm() {
    setEditingId(null);
    setTitle("");
    setSummary("");
    setLink("");
    setSource("");
    setCategory("press");
    setStatus("published");
    setPublishedAt("");
  }

  function handleEdit(item: NewsItem) {
    setEditingId(item.id ?? null);
    setTitle(item.title ?? "");
    setSummary(item.summary ?? "");
    setLink(item.link ?? "");
    setSource(item.source ?? "");
    setCategory((item.category as "press" | "interview" | "media" | "video") ?? "press");
    setStatus((item.status as "published" | "draft") ?? "published");
    setPublishedAt(item.published_at ? item.published_at.slice(0, 16) : "");
    setErrorText("");
    setSuccessText("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleSubmit() {
    setErrorText("");
    setSuccessText("");

    if (!title.trim()) {
      setErrorText("제목을 입력해 주세요.");
      return;
    }

    if (!link.trim()) {
      setErrorText("링크를 입력해 주세요.");
      return;
    }

    setLoading(true);

    const payload = {
      title: title.trim(),
      summary: summary.trim() || null,
      link: link.trim(),
      source: source.trim() || null,
      category,
      status,
      published_at: publishedAt || new Date().toISOString(),
    };

    if (editingId) {
      const { error } = await updateNews(editingId, payload);

      if (error) {
        setErrorText(error.message);
        setLoading(false);
        return;
      }

      setSuccessText("뉴스가 수정되었습니다.");
    } else {
      const { error } = await createNews(payload);

      if (error) {
        setErrorText(error.message);
        setLoading(false);
        return;
      }

      setSuccessText("뉴스가 등록되었습니다.");
    }

    resetForm();
    await loadNews();
    setLoading(false);
  }

  async function handleDelete(id?: string, itemTitle?: string) {
    if (!id) return;

    const ok = window.confirm(`"${itemTitle ?? "이 뉴스"}"를 삭제하시겠습니까?`);
    if (!ok) return;

    setErrorText("");
    setSuccessText("");

    const { error } = await deleteNews(id);

    if (error) {
      setErrorText(error.message);
      return;
    }

    setSuccessText("뉴스가 삭제되었습니다.");
    await loadNews();

    if (editingId === id) {
      resetForm();
    }
  }

  return (
    <div className="space-y-8">
      <section className="rounded-xl border border-ink/15 bg-white/70 p-6 md:p-8">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold" style={{ color: "var(--color-navy)" }}>
              {editingId ? "뉴스 수정" : "뉴스 등록"}
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              뉴스룸에 노출할 보도자료, 인터뷰, 언론 기사, 영상 링크를 등록하거나 수정합니다.
            </p>
          </div>

          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              className="rounded-md border border-ink/15 px-3 py-2 text-sm"
            >
              수정 취소
            </button>
          )}
        </div>

        {(errorText || successText) && (
          <div className="mt-5 space-y-2">
            {errorText && (
              <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {errorText}
              </div>
            )}
            {successText && (
              <div className="rounded-md border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                {successText}
              </div>
            )}
          </div>
        )}

        <div className="mt-6 grid gap-4">
          <div className="grid gap-2">
            <label className="text-sm font-medium">제목</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="뉴스 제목을 입력하세요"
              className="rounded-md border border-ink/15 bg-white px-4 py-3 outline-none"
            />
          </div>

          <div className="grid gap-2">
            <label className="text-sm font-medium">링크</label>
            <input
              value={link}
              onChange={(e) => setLink(e.target.value)}
              placeholder="https://example.com/news"
              className="rounded-md border border-ink/15 bg-white px-4 py-3 outline-none"
            />
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="grid gap-2">
              <label className="text-sm font-medium">출처</label>
              <input
                value={source}
                onChange={(e) => setSource(e.target.value)}
                placeholder="예: 성남시, OBS, 유튜브"
                className="rounded-md border border-ink/15 bg-white px-4 py-3 outline-none"
              />
            </div>

            <div className="grid gap-2">
              <label className="text-sm font-medium">카테고리</label>
              <select
                value={category}
                onChange={(e) =>
                  setCategory(e.target.value as "press" | "interview" | "media" | "video")
                }
                className="rounded-md border border-ink/15 bg-white px-4 py-3 outline-none"
              >
                {CATEGORY_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="grid gap-2">
              <label className="text-sm font-medium">상태</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as "published" | "draft")}
                className="rounded-md border border-ink/15 bg-white px-4 py-3 outline-none"
              >
                <option value="published">게시</option>
                <option value="draft">임시저장</option>
              </select>
            </div>

            <div className="grid gap-2">
              <label className="text-sm font-medium">게시 일시</label>
              <input
                type="datetime-local"
                value={publishedAt}
                onChange={(e) => setPublishedAt(e.target.value)}
                className="rounded-md border border-ink/15 bg-white px-4 py-3 outline-none"
              />
            </div>
          </div>

          <div className="grid gap-2">
            <label className="text-sm font-medium">요약</label>
            <textarea
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="뉴스 요약을 입력하세요"
              className="min-h-32 rounded-md border border-ink/15 bg-white px-4 py-3 outline-none"
            />
          </div>

          <div className="flex items-center gap-2 pt-2">
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="inline-flex items-center rounded-md px-5 py-3 text-sm font-semibold text-white disabled:opacity-60"
              style={{ background: "var(--color-navy)" }}
            >
              {loading ? (editingId ? "수정 중..." : "등록 중...") : editingId ? "뉴스 수정" : "뉴스 등록"}
            </button>

            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="inline-flex items-center rounded-md border border-ink/15 px-5 py-3 text-sm font-semibold"
              >
                취소
              </button>
            )}
          </div>
        </div>
      </section>

      <section className="rounded-xl border border-ink/15 bg-white/70 p-6 md:p-8">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold" style={{ color: "var(--color-navy)" }}>
              뉴스 목록
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              등록된 뉴스 항목을 확인하고 수정하거나 삭제할 수 있습니다.
            </p>
          </div>
          <div className="text-xs text-muted-foreground">총 {items.length}건</div>
        </div>

        {listLoading ? (
          <div className="py-10 text-sm text-muted-foreground">목록을 불러오는 중...</div>
        ) : items.length === 0 ? (
          <div className="py-10 text-sm text-muted-foreground">등록된 뉴스가 없습니다.</div>
        ) : (
          <div className="mt-6 space-y-3">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex flex-col gap-4 rounded-lg border border-ink/10 bg-white p-4 md:flex-row md:items-center md:justify-between"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <span className="rounded-full border border-ink/15 px-2 py-1">
                      {item.category || "media"}
                    </span>
                    <span className="rounded-full border border-ink/15 px-2 py-1">
                      {item.status || "published"}
                    </span>
                    <span className="text-muted-foreground">
                      {formatDate(item.published_at)}
                    </span>
                  </div>

                  <div className="mt-3 break-words text-base font-semibold">
                    {item.title}
                  </div>

                  <div className="mt-1 break-all text-sm text-muted-foreground">
                    {item.source || "출처 없음"}
                    {item.link ? ` · ${item.link}` : ""}
                  </div>

                  {item.summary && (
                    <p className="mt-2 text-sm leading-[1.7] text-foreground/75">
                      {item.summary}
                    </p>
                  )}
                </div>

                <div className="flex shrink-0 items-center gap-2">
                  {item.link && (
                    <a
                      href={item.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-md border border-ink/15 px-3 py-2 text-sm"
                    >
                      보기
                    </a>
                  )}

                  <button
                    type="button"
                    onClick={() => handleEdit(item)}
                    className="rounded-md border border-ink/15 px-3 py-2 text-sm"
                  >
                    수정
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDelete(item.id, item.title)}
                    className="rounded-md border border-red-200 px-3 py-2 text-sm text-red-600"
                  >
                    삭제
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}