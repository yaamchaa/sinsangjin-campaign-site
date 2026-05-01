import "jsr:@supabase/functions-js/edge-runtime.d.ts";

type VoiceRow = {
  id?: string;
  title?: string | null;
  content?: string | null;
  district?: string | null;
  category?: string | null;
  author_name?: string | null;
  author_email?: string | null;
  created_at?: string | null;
  published?: boolean | null;
  status?: string | null;
};

type WebhookPayload = {
  type?: string;
  table?: string;
  schema?: string;
  record?: VoiceRow | null;
  old_record?: VoiceRow | null;
};

const DISTRICT_LABEL: Record<string, string> = {
  sujeong: "수정구",
  jungwon: "중원구",
  bundang: "분당구",
  etc: "기타·전체",
};

const CATEGORY_LABEL: Record<string, string> = {
  welfare: "복지·돌봄",
  transport: "교통·도로",
  redev: "재개발·재건축",
  education: "교육·청년",
  economy: "경제·일자리",
  etc: "기타",
};

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function limitText(value: string, max = 240) {
  if (value.length <= max) return value;
  return `${value.slice(0, max)}...`;
}

Deno.serve(async (req: Request) => {
  try {
    if (req.method !== "POST") {
      return new Response(JSON.stringify({ error: "Method not allowed" }), {
        status: 405,
        headers: { "Content-Type": "application/json" },
      });
    }

    const webhookSecret = Deno.env.get("VOICE_WEBHOOK_SECRET");
    const requestSecret =
      req.headers.get("x-webhook-secret") ||
      req.headers.get("webhook-secret") ||
      "";

    if (!webhookSecret || requestSecret !== webhookSecret) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    const payload = (await req.json()) as WebhookPayload;

    if (payload.table !== "voice_messages") {
      return new Response(JSON.stringify({ ok: true, skipped: "not_voice_messages" }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    const row = payload.record;
    if (!row) {
      return new Response(JSON.stringify({ ok: true, skipped: "no_record" }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    const telegramBotToken = Deno.env.get("TELEGRAM_BOT_TOKEN");
    const telegramChatId = Deno.env.get("TELEGRAM_CHAT_ID");
    const adminUrl = Deno.env.get("ADMIN_VOICE_URL") || "https://YOUR-DOMAIN/admin-news";

    if (!telegramBotToken || !telegramChatId) {
      return new Response(JSON.stringify({ error: "Missing telegram secrets" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    const district = DISTRICT_LABEL[row.district ?? ""] ?? (row.district || "-");
    const category = CATEGORY_LABEL[row.category ?? ""] ?? (row.category || "-");
    const title = row.title?.trim() || "(제목 없음)";
    const content = row.content?.trim() || "(내용 없음)";
    const author = row.author_name?.trim() || "익명 시민";
    const email = row.author_email?.trim() || "-";
    const createdAt = row.created_at
      ? new Date(row.created_at).toLocaleString("ko-KR", { timeZone: "Asia/Seoul" })
      : "-";

    const message = [
      "🔔 <b>새 시민목소리 접수</b>",
      "",
      `<b>제목</b>: ${escapeHtml(title)}`,
      `<b>작성자</b>: ${escapeHtml(author)}`,
      `<b>이메일</b>: ${escapeHtml(email)}`,
      `<b>지역</b>: ${escapeHtml(district)}`,
      `<b>분야</b>: ${escapeHtml(category)}`,
      `<b>등록시각</b>: ${escapeHtml(createdAt)}`,
      "",
      `<b>내용</b>`,
      escapeHtml(limitText(content, 400)),
      "",
      `<a href="${adminUrl}">관리자 화면 열기</a>`,
    ].join("\n");

    const telegramRes = await fetch(
      `https://api.telegram.org/bot${telegramBotToken}/sendMessage`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chat_id: telegramChatId,
          text: message,
          parse_mode: "HTML",
          disable_web_page_preview: true,
        }),
      }
    );

    const telegramJson = await telegramRes.json();

    if (!telegramRes.ok) {
      return new Response(
        JSON.stringify({
          error: "Telegram send failed",
          detail: telegramJson,
        }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    return new Response(JSON.stringify({ ok: true, telegram: telegramJson }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
});