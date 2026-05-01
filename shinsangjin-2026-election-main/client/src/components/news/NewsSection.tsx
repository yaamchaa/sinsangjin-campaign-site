import { useEffect, useState } from "react";
import { getNews, type NewsItem } from "@/lib/news";

export default function NewsSection() {
  const [items, setItems] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadNews();
  }, []);

  async function loadNews() {
    const { data, error } = await getNews(6);
    if (!error && data) setItems(data);
    setLoading(false);
  }

  return (
    <section className="container py-16">
      <div className="mb-6 flex items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold">뉴스</h2>
          <p className="mt-1 text-sm text-muted-foreground">최근 소식과 보도자료를 확인하세요.</p>
        </div>
      </div>

      {loading ? (
        <p className="text-sm text-muted-foreground">뉴스 불러오는 중...</p>
      ) : items.length === 0 ? (
        <p className="text-sm text-muted-foreground">등록된 뉴스가 없습니다.</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {items.map((item) => (
            <article key={item.id} className="rounded-xl border border-ink/15 bg-white/70 p-5">
              <a href={item.link} target="_blank" rel="noopener noreferrer" className="block">
                <h3 className="text-lg font-semibold">{item.title}</h3>
              </a>
              {item.summary && <p className="mt-2 text-sm text-muted-foreground">{item.summary}</p>}
              <div className="mt-3 text-xs text-muted-foreground">
                {item.source || "source"} {item.published_at ? `· ${item.published_at}` : ""}
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}