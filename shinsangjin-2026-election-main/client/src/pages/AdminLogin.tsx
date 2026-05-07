import { useEffect, useState } from "react";
import { useLocation, Link } from "wouter";
import { supabase } from "@/lib/supabase";

const ADMIN_EMAILS = ["press@seongnam2026.kr"];

function isAdminEmail(email?: string | null) {
  if (!email) return false;
  return ADMIN_EMAILS.includes(email.toLowerCase().trim());
}

export default function AdminLogin() {
  const [, setLocation] = useLocation();
  const [email, setEmail] = useState("press@seongnam2026.kr");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);
  const [errorText, setErrorText] = useState("");

  useEffect(() => {
    void checkSession();
  }, []);

  async function checkSession() {
    try {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();

      if (error || !session?.user) {
        setChecking(false);
        return;
      }

      const signedInEmail = session.user.email ?? "";

      if (isAdminEmail(signedInEmail)) {
        setLocation("/admin-news");
        return;
      }

      await supabase.auth.signOut();
      setErrorText("일반 사용자 계정이 로그인되어 있어 관리자 로그인을 위해 로그아웃했습니다.");
      setChecking(false);
    } catch (error) {
      console.error("Admin login session check failed:", error);
      setChecking(false);
    }
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErrorText("");

    const inputEmail = email.trim().toLowerCase();

    if (!isAdminEmail(inputEmail)) {
      setErrorText("관리자 계정으로 등록된 이메일만 로그인할 수 있습니다.");
      setLoading(false);
      return;
    }

    const { error } = await supabase.auth.signInWithPassword({
      email: inputEmail,
      password,
    });

    if (error) {
      setErrorText("로그인에 실패했습니다. 이메일 또는 비밀번호를 확인해 주세요.");
      setLoading(false);
      return;
    }

    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession();

    if (sessionError || !session?.user || !isAdminEmail(session.user.email)) {
      await supabase.auth.signOut();
      setErrorText("관리자 권한이 확인되지 않아 접근할 수 없습니다.");
      setLoading(false);
      return;
    }

    setLocation("/admin-news");
  }

  if (checking) {
    return (
      <div className="paper-texture">
        <div className="container py-20">
          <div className="rounded-xl border border-ink/15 bg-white/70 p-8 text-center">
            <p className="text-sm text-muted-foreground">관리자 로그인 상태 확인 중...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="paper-texture">
      <section className="border-b border-ink/15">
        <div className="container py-20 md:py-28">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-end">
            <div className="lg:col-span-8">
              <div className="chapter-label">Admin · Sign In</div>
              <h1
                className="mt-6 text-[clamp(2.5rem,6vw,4.5rem)] leading-[1.05]"
                style={{ color: "var(--color-navy)" }}
              >
                관리자
                <br />
                <span style={{ color: "var(--color-brick)" }}>로그인</span>
              </h1>
              <p className="mt-6 max-w-2xl text-[17px] leading-[1.8] text-foreground/80">
                뉴스 등록 및 삭제, 시민 제안 답변 관리는 관리자 계정으로 로그인한 뒤 사용할 수 있습니다.
                미리 등록된 관리자 이메일과 비밀번호로 로그인해 주세요.
              </p>
            </div>

            <div className="lg:col-span-4">
              <div className="border-t border-ink/30 pt-6">
                <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                  Access
                </div>
                <div className="mt-4 text-sm text-foreground/80">
                  관리자 전용 페이지입니다.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className="container py-16 md:py-20">
          <div className="mx-auto max-w-xl rounded-xl border border-ink/15 bg-white/70 p-6 md:p-8">
            <h2
              className="text-2xl font-semibold"
              style={{ color: "var(--color-navy)" }}
            >
              관리자 로그인
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Supabase에 등록된 관리자 계정만 접근할 수 있습니다.
            </p>

            <form onSubmit={handleLogin} className="mt-6 space-y-4">
              <div className="grid gap-2">
                <label className="text-sm font-medium">이메일</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="rounded-md border border-ink/15 bg-white px-4 py-3 outline-none"
                  placeholder="admin@example.com"
                  autoComplete="email"
                />
              </div>

              <div className="grid gap-2">
                <label className="text-sm font-medium">비밀번호</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="rounded-md border border-ink/15 bg-white px-4 py-3 outline-none"
                  placeholder="비밀번호를 입력하세요"
                  autoComplete="current-password"
                />
              </div>

              {errorText && (
                <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {errorText}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center rounded-md px-5 py-3 text-sm font-semibold text-white disabled:opacity-60"
                style={{ background: "var(--color-navy)" }}
              >
                {loading ? "로그인 중..." : "로그인"}
              </button>
            </form>

            <div className="mt-6 text-sm text-muted-foreground space-y-2">
              <div>
                공개 뉴스룸은{" "}
                <Link href="/newsroom" className="underline underline-offset-4">
                  여기
                </Link>
                에서 볼 수 있습니다.
              </div>
              <div>
                시민 제안 등록은{" "}
                <Link href="/voice" className="underline underline-offset-4">
                  시민목소리
                </Link>
                에서 할 수 있습니다.
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
