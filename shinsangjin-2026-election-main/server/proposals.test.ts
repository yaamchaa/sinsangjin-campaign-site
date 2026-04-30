import { beforeEach, describe, expect, it, vi } from "vitest";
import type { TrpcContext } from "./_core/context";

// Mock db helpers BEFORE importing routers
const mockListProposals = vi.fn();
const mockCreateProposal = vi.fn();
const mockListNewsItems = vi.fn();
const mockCreateNewsItem = vi.fn();
const mockGetNewsCount = vi.fn();

vi.mock("./db", () => ({
  listProposals: (...args: unknown[]) => mockListProposals(...args),
  createProposal: (...args: unknown[]) => mockCreateProposal(...args),
  listNewsItems: (...args: unknown[]) => mockListNewsItems(...args),
  createNewsItem: (...args: unknown[]) => mockCreateNewsItem(...args),
  getNewsCount: (...args: unknown[]) => mockGetNewsCount(...args),
}));

// Now import after mocks are set up
const { appRouter } = await import("./routers");

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function makeCtx(authed: boolean): TrpcContext {
  const user: AuthenticatedUser | null = authed
    ? {
        id: 42,
        openId: "tester-openid",
        email: "tester@example.com",
        name: "테스트 시민",
        loginMethod: "manus",
        role: "user",
        createdAt: new Date(),
        updatedAt: new Date(),
        lastSignedIn: new Date(),
      }
    : null;

  return {
    user,
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: { clearCookie: () => {} } as unknown as TrpcContext["res"],
  };
}

describe("proposals router", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("list returns whatever db returns", async () => {
    mockListProposals.mockResolvedValueOnce([
      {
        id: 1,
        userId: 1,
        authorName: "홍길동",
        district: "bundang",
        category: "redev",
        title: "분당 재건축 관련",
        content: "재건축 일정을 더 빠르게 진행해주세요.",
        status: "pending",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
    const caller = appRouter.createCaller(makeCtx(false));
    const result = await caller.proposals.list();
    expect(result).toHaveLength(1);
    expect(result[0]?.title).toBe("분당 재건축 관련");
  });

  it("create requires authentication", async () => {
    const caller = appRouter.createCaller(makeCtx(false));
    await expect(
      caller.proposals.create({
        district: "bundang",
        category: "redev",
        title: "제안 제목",
        content: "충분히 긴 본문 내용입니다.",
      }),
    ).rejects.toThrow();
    expect(mockCreateProposal).not.toHaveBeenCalled();
  });

  it("create succeeds for authenticated user and uses ctx user info", async () => {
    mockCreateProposal.mockResolvedValueOnce(undefined);
    const caller = appRouter.createCaller(makeCtx(true));
    const result = await caller.proposals.create({
      district: "sujeong",
      category: "transport",
      title: "야탑역 혼잡 완화",
      content: "출퇴근 시간대 야탑역 혼잡이 너무 심합니다.",
    });
    expect(result).toEqual({ success: true });
    expect(mockCreateProposal).toHaveBeenCalledTimes(1);
    const arg = mockCreateProposal.mock.calls[0][0] as Record<string, unknown>;
    expect(arg.userId).toBe(42);
    expect(arg.authorName).toBe("테스트 시민");
    expect(arg.district).toBe("sujeong");
    expect(arg.category).toBe("transport");
  });

  it("create rejects too short content", async () => {
    const caller = appRouter.createCaller(makeCtx(true));
    await expect(
      caller.proposals.create({
        district: "etc",
        category: "etc",
        title: "짧",
        content: "짧은내용",
      }),
    ).rejects.toThrow();
  });
});

describe("news router", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("list seeds news on empty DB and returns items", async () => {
    mockGetNewsCount.mockResolvedValueOnce(0);
    mockCreateNewsItem.mockResolvedValue(undefined);
    mockListNewsItems.mockResolvedValueOnce([
      {
        id: 1,
        category: "press",
        title: "보도자료 샘플",
        summary: "요약",
        source: "성남시",
        publishedAt: new Date(),
        link: "#",
        createdAt: new Date(),
      },
    ]);
    const caller = appRouter.createCaller(makeCtx(false));
    const result = await caller.news.list();
    expect(mockGetNewsCount).toHaveBeenCalled();
    // seed should have been triggered
    expect(mockCreateNewsItem).toHaveBeenCalled();
    expect(result.length).toBeGreaterThanOrEqual(1);
  });

  it("list does not re-seed when DB already has items", async () => {
    mockGetNewsCount.mockResolvedValueOnce(5);
    mockListNewsItems.mockResolvedValueOnce([]);
    const caller = appRouter.createCaller(makeCtx(false));
    await caller.news.list();
    expect(mockCreateNewsItem).not.toHaveBeenCalled();
  });
});
