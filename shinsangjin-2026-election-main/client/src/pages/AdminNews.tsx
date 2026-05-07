import { useEffect, useState } from "react";
import { useLocation, Link } from "wouter";
import NewsAdminPanel from "@/components/news/NewsAdminPanel";
import VoiceAdminPanel from "@/components/news/VoiceAdminPanel";
import { supabase } from "@/lib/supabase";

const ADMIN_EMAILS = ["press@seongnam2026.kr"];

function isAdminEmail(email?: string | null) {
  if (!email) return false;
  return ADMIN_EMAILS.includes(email.toLowerCase().trim());
}

type AdminSection = "news" | "voice";

export default function AdminNews() {
  const [, setLocation] = useLocation();
  const [checking, setChecking] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAuthorizedAdmin, setIsAuthorizedAdmin] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [logoutLoading, setLogoutLoading] = useState(false);
  const [accessDeniedMessage, setAccessDeniedMessage] = useState("");
  const [activeSection, setActiveSection] = useState<AdminSection>("news");

  useEffect(() => {
    void checkUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      const email = session?.user?.email ?? "";

      if (!session?.user) {
        setIsLoggedIn(false);
        setIsAuthorizedAdmin(false);
        setUserEmail("");
        setAccessDeniedMessage("관리자 로그인 후 다시 접근해 주세요.");
        setChecking(false);
        return;
      }

      const authorized = isAdminEmail(email);

      setIsLoggedIn(true);
      setUserEmail(email);
      setIsAuthorizedAdmin(authorized);
      setChecking(false);

      if (!authorized) {
        setAccessDeniedMessage("현재 로그인된 계정은 관리자 권한이 없어 접근할 수 없습니다.");
        await supabase.auth.signOut();
        setLocation("/admin-login");
        return;
      }

      setAccessDeniedMessage("");
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [setLocation]);

  async function checkUser() {
    setChecking(true);

    try {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();

      if (error || !session?.user) {
        setIsLoggedIn(false);
        setIsAuthorizedAdmin(false);
        setUserEmail("");
        setAccessDeniedMessage("관리자 로그인 후 다시 접근해 주세요.");
        setChecking(false);
        return;
      }

      const email = session.user.email ?? "";
      const authorized = isAdminEmail(email);

      setIsLoggedIn(true);
      setUserEmail(email);
      setIsAuthorizedAdmin(authorized);
      setChecking(false);

      if (!authorized) {
        setAccessDeniedMessage("현재 로그인된 계정은 관리자 권한이 없어 뉴스 관리 페이지에 접근할 수 없습니다.");
        await supabase.auth.signOut();
        setLocation("/admin-login");
        return;
      }

      setAccessDeniedMessage("");
    } catch (error) {
      console.error("Admin auth check failed:", error);
      setIsLoggedIn(false);
      setIsAuthorizedAdmin(false);
      setUserEmail("");
      setAccessDeniedMessage("관리자 인증 확인 중 오류가 발생했습니다. 다시 로그인해 주세요.");
      setChecking(false);
    }
  }

  async function handleLogout() {
    setLogoutLoading(true);

    const { error } = await supabase.auth.signOut();

    if (error) {
      alert("로그아웃에 실패했습니다. 다시 시도해 주세요.");
      setLogoutLoading(false);
      return;
    }

    setIsLoggedIn(false);
    setIsAuthorizedAdmin(false);
    setUserEmail("");
    setAccessDeniedMessage("");
    setLogoutLoading(false);
    setLocation("/admin-login");
  }

  if (checking) {
    return (
      <div className="paper-texture">
        <div className="container py-20">
          <div className="rounded-xl border border-ink/15 bg-white/70 p-8 text-center">
            <p className="text-sm text-muted-foreground">관리자 권한 확인 중...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!isLoggedIn || !isAuthorizedAdmin) {
    return (
      <div className="paper-texture">
        <section className="border-b border-ink/15">
          <div className="container py-20 md:py-28">
            <div className="max-w-3xl">
              <div className="chapter-label">Admin · News Control</div>
              <h1
                className="mt-6 text-[clamp(2.25rem,5vw,4rem)] leading-[1.08]"
                style={{ color: "var(--color-navy)" }}
              >
                뉴스 관리 페이지
              </h1>
              <p className="mt-6 max-w-2xl text-[17px] leading-[1.8] text-foreground/80">
                이 페이지는 로그인한 관리자만 접근할 수 있습니다.
              </p>
            </div>
          </div>
        </section>

        <div className="container py-16">
          <div className="rounded-xl border border-dashed border-ink/20 bg-white/70 p-8 md:p-10">
            <h2
              className="text-2xl font-semibold"
              style={{ color: "var(--color-navy)" }}
            >
              접근 권한이 없습니다
            </h2>

            <p className="mt-3 text-sm leading-[1.8] text-muted-foreground">
              {accessDeniedMessage || "관리자 로그인 후 다시 접근해 주세요."}
            </p>

            {userEmail && (
              <div className="mt-4 text-sm text-muted-foreground">
                현재 로그인 계정:
                <div className="mt-1 break-all font-editorial italic text-foreground/80">
                  {userEmail}
                </div>
              </div>
            )}

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => setLocation("/admin-login")}
                className="inline-flex items-center rounded-md px-5 py-3 text-sm font-semibold text-white"
                style={{ background: "var(--color-navy)" }}
              >
                관리자 로그인
              </button>

              <Link
                href="/newsroom"
                className="inline-flex items-center rounded-md border border-ink/15 px-5 py-3 text-sm font-semibold"
              >
                뉴스룸 보기
              </Link>

              <button
                type="button"
                onClick={() => setLocation("/voice")}
                className="inline-flex items-center rounded-md border border-ink/15 px-5 py-3 text-sm font-semibold"
              >
                시민목소리로 이동
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="paper-texture">
      <section className="border-b border-ink/15">
        <div className="container py-20 md:py-28">
          <div className="grid grid-cols-1 items-end gap-10 lg:grid-cols-12">
            <div className="lg:col-span-8">
              <div className="chapter-label">Admin · News Control</div>
              <h1
                className="mt-6 text-[clamp(2.5rem,6vw,4.5rem)] leading-[1.05]"
                style={{ color: "var(--color-navy)" }}
              >
                등록하고,
                <br />
                <span style={{ color: "var(--color-brick)" }}>수정하고 정리하는</span> 관리자 화면.
              </h1>
              <p className="mt-6 max-w-2xl text-[17px] leading-[1.8] text-foreground/80">
                뉴스와 시민의 목소리를 탭으로 전환하며 관리할 수 있습니다. 현재 작업 중인 섹션만 보여 주어 긴 화면에서도 헷갈리지 않습니다.
              </p>

              <div className="mt-8 inline-flex rounded-xl border border-ink/15 bg-white/60 p-1">
                <button
                  type="button"
                  onClick={() => setActiveSection("news")}
                  className="rounded-lg px-4 py-2 text-sm font-semibold transition"
                  style={{
                    background: activeSection === "news" ? "var(--color-navy)" : "transparent",
                    color: activeSection === "news" ? "var(--color-paper)" : "var(--color-ink)",
                  }}
                >
                  뉴스 관리
                </button>
                <button
                  type="button"
                  onClick={() => setActiveSection("voice")}
                  className="rounded-lg px-4 py-2 text-sm font-semibold transition"
                  style={{
                    background: activeSection === "voice" ? "var(--color-brick)" : "transparent",
                    color: activeSection === "voice" ? "var(--color-paper)" : "var(--color-ink)",
                  }}
                >
                  시민목소리 관리
                </button>
              </div>
            </div>

            <div className="lg:col-span-4">
              <div className="border-t border-ink/30 pt-6">
                <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                  Signed In
                </div>

                <div className="mt-4 text-sm text-foreground/80">
                  <div>로그인 사용자</div>
                  <div className="mt-1 break-all font-editorial italic text-muted-foreground">
                    {userEmail || "관리자"}
                  </div>
                </div>

                <div className="mt-5 flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={handleLogout}
                    disabled={logoutLoading}
                    className="inline-flex items-center rounded-md border border-ink/15 px-4 py-2 text-sm font-semibold disabled:opacity-60"
                  >
                    {logoutLoading ? "로그아웃 중..." : "로그아웃"}
                  </button>

                  <Link
                    href="/newsroom"
                    className="inline-flex items-center rounded-md border border-ink/15 px-4 py-2 text-sm font-semibold"
                  >
                    공개 뉴스룸
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className="container py-16 md:py-20">
          {activeSection === "news" ? <NewsAdminPanel /> : <VoiceAdminPanel />}
        </div>
      </section>
    </div>
  );
}
