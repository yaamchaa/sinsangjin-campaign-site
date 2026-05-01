import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { createClient } from "@supabase/supabase-js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, "../.env.local") });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl) throw new Error("VITE_SUPABASE_URL 값이 없습니다.");
if (!supabaseAnonKey) throw new Error("VITE_SUPABASE_ANON_KEY 값이 없습니다.");

const supabase = createClient(supabaseUrl, supabaseAnonKey);

type NewsItem = {
  title: string;
  summary: string;
  category: string;
  source: string;
  publishedAt: string;
  link: string;
};

const NEWS_EXAMPLE: NewsItem[] = [
  {
    title: "보도자료: 신상진 캠프, 분당구 142개 공약 이행 완료",
    summary: "성남시 분당구에서 총 142개 공약이 이행 완료되었습니다.",
    category: "press",
    source: "신상진 캠프 공식 보도자료",
    publishedAt: "2026-04-30T08:00:00Z",
    link: "https://link.to/press-001",
  },
  {
    title: "인터뷰: 구민의 목소리에 귀 기울이는 캠프",
    summary: "구민들의 의견을 듣기 위해 캠프가 직접 취재에 나섰습니다.",
    category: "interview",
    source: "SBS 방송 인터뷰",
    publishedAt: "2026-04-29T11:30:00Z",
    link: "https://link.to/interview-001",
  },
  {
    title: "언론 기사: 시정 영상, 성남의 변화를 기록하다",
    summary: "성남시의 주요 정책을 담은 영상 기사입니다.",
    category: "media",
    source: "성남시 공식 홈페이지",
    publishedAt: "2026-04-28T15:45:00Z",
    link: "https://link.to/media-001",
  },
  {
    title: "영상: 시민과 함께하는 캠프 일상편",
    summary: "캠프 일상과 구민과의 소통을 담은 영상입니다.",
    category: "video",
    source: "유튜브 공식 채널",
    publishedAt: "2026-04-27T18:20:00Z",
    link: "https://youtu.be/example",
  },
];

async function syncNews() {
  for (const item of NEWS_EXAMPLE) {
    const payload = {
      title: item.title,
      summary: item.summary,
      category: item.category,
      source: item.source,
      published_at: item.publishedAt,
      link: item.link,
      status: "published",
    };

    const { error } = await supabase.from("news").upsert(payload, { onConflict: "link" });

    if (error) console.error(`뉴스 삽입 실패: ${item.link} / ${error.message}`);
    else console.log(`뉴스 삽입 성공: ${item.link}`);
  }
}

async function run() {
  console.log("=== 뉴스 동기화 시작 ===");
  await syncNews();
  console.log("=== 뉴스 동기화 끝 ===");
}

run().catch((error) => {
  console.error("실행 중 오류:", error);
  process.exit(1);
});
