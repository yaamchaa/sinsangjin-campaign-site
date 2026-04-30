import { COOKIE_NAME } from "@shared/const";
import { z } from "zod";
import {
  createNewsItem,
  createProposal,
  getNewsCount,
  listNewsItems,
  listProposals,
} from "./db";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { adminProcedure, protectedProcedure, publicProcedure, router } from "./_core/trpc";

// === Seed news items if DB is empty (called on first list) ===
const SEED_NEWS = [
  {
    category: "press" as const,
    title: "신상진 성남시장, 분당 재건축 선도지구 4개 단지 지정 발표",
    summary:
      "국토교통부 1기 신도시 선도지구 지정에 발맞춰 분당 시범단지·샛별마을·목련마을·양지마을 4개 단지가 특별정비구역으로 확정되었다.",
    source: "성남시 보도자료",
    publishedAt: new Date("2025-12-30"),
    link: "https://www.seongnam.go.kr",
  },
  {
    category: "interview" as const,
    title: "[인터뷰] 신상진 시장 \"공약 이행률 96.1%, 숫자로 증명한 시정\"",
    summary:
      "민선 8기 4년을 마무리하며 신상진 시장이 공약 이행 성과와 다음 4년의 비전을 밝혔다.",
    source: "중앙일보",
    publishedAt: new Date("2026-03-15"),
    link: "#",
  },
  {
    category: "media" as const,
    title: "성남시, 재정자립도 전국 1위 4년 연속 유지",
    summary:
      "행정안전부 발표에 따르면 성남시는 경기도 31개 시·군 중 가장 높은 재정자립도를 기록했다.",
    source: "한국경제",
    publishedAt: new Date("2026-02-20"),
    link: "#",
  },
  {
    category: "press" as const,
    title: "수정·중원 5개 재개발 구역, 2026년 말 정비구역 지정 목표",
    summary:
      "수진2·태평2·4·산성·단대·상대원1·3 5개 구역의 정비계획 수립이 본격화되며 1만 1천여 세대의 신규 공급이 예정됐다.",
    source: "성남시 보도자료",
    publishedAt: new Date("2026-04-10"),
    link: "#",
  },
  {
    category: "video" as const,
    title: "[영상] 신상진 시장의 '함께 성남' 출마 선언",
    summary:
      "2026년 6월 3일 지방선거 출마를 공식 선언하며 시민과 함께 성남의 미래를 완성하겠다고 밝혔다.",
    source: "성남시 공식 채널",
    publishedAt: new Date("2026-04-20"),
    link: "#",
  },
  {
    category: "interview" as const,
    title: "[심층] 의사 출신 시장이 본 성남의 공공의료 미래",
    summary:
      "제32대 대한의사협회 회장 출신의 신상진 시장이 성남형 공공의료 모델의 비전을 제시한다.",
    source: "메디게이트뉴스",
    publishedAt: new Date("2026-01-08"),
    link: "#",
  },
];

async function ensureSeedNews() {
  const count = await getNewsCount();
  if (count > 0) return;
  for (const item of SEED_NEWS) {
    try {
      await createNewsItem(item);
    } catch (e) {
      console.warn("[seed news] failed", e);
    }
  }
}

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),

  // ============================
  // 시민의 목소리 (정책 제안)
  // ============================
  proposals: router({
    list: publicProcedure.query(async () => {
      return listProposals(50);
    }),
    create: protectedProcedure
      .input(
        z.object({
          district: z.enum(["sujeong", "jungwon", "bundang", "etc"]),
          category: z.enum([
            "welfare",
            "transport",
            "redev",
            "education",
            "economy",
            "etc",
          ]),
          title: z.string().min(2).max(200),
          content: z.string().min(10).max(2000),
        }),
      )
      .mutation(async ({ ctx, input }) => {
        await createProposal({
          userId: ctx.user.id,
          authorName: ctx.user.name ?? "익명 시민",
          district: input.district,
          category: input.category,
          title: input.title,
          content: input.content,
        });
        return { success: true } as const;
      }),
  }),

  // ============================
  // 뉴스룸
  // ============================
  news: router({
    list: publicProcedure.query(async () => {
      await ensureSeedNews();
      return listNewsItems(100);
    }),
    create: adminProcedure
      .input(
        z.object({
          category: z.enum(["press", "interview", "media", "video"]),
          title: z.string().min(2).max(300),
          summary: z.string().min(2),
          source: z.string().min(1).max(100),
          publishedAt: z.date(),
          link: z.string().optional(),
        }),
      )
      .mutation(async ({ input }) => {
        await createNewsItem(input);
        return { success: true } as const;
      }),
  }),
});

export type AppRouter = typeof appRouter;
