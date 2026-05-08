import { useMemo, useState } from "react";
import { Link, useLocation } from "wouter";
import { supabase } from "@/lib/supabase";

function getReturnTo() {
  const hash = window.location.hash || "";
  const hashQueryIndex = hash.indexOf("?");
  const hashQuery = hashQueryIndex >= 0 ? hash.substring(hashQueryIndex + 1) : "";
  const search = window.location.search || "";

  const hashParams = new URLSearchParams(hashQuery);
  const searchParams = new URLSearchParams(search);

  const returnToFromHash = hashParams.get("returnTo");
  const returnToFromSearch = searchParams.get("returnTo");
  const returnTo = returnToFromHash || returnToFromSearch || "/voice";

  if (!returnTo.startsWith("/")) {
    return "/voice";
  }

  return returnTo;
}

function getBaseUrl() {
  return `${window.location.origin}/sinsangjin-campaign-site`;
}

function getEmailRedirectTo() {
  return `${getBaseUrl()}/`;
}

export default function UserLogin() {
  const [, setLocation] = useLocation();

  const returnTo = useMemo(() => getReturnTo(), []);

  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<"email" | "otp">("email");
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const [message, setMessage] = useState("");
  const [errorText, setErrorText] = useState("");

  async function handleSendOtp(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setErrorText("");
    setMessage("");

    const normalizedEmail = email.trim();

    if (!normalizedEmail) {
      setErrorText("이메일을 입력해 주세요.");
      setLoading(false);
      return;
    }

    const { error } = await supabase.auth.signInWithOtp({
      email: normalizedEmail,
      options: {
        emailRedirectTo: getEmailRedirectTo(),
      },
    });

    if (error) {
      setErrorText(error.message || "인증번호 전송에 실패했습니다.");
      setLoading(false);
      return;
    }

    setStep("otp");
    setMessage("이메일로 인증번호를 보냈습니다. 받은 6자리 코드를 입력해 주세요.");
    setLoading(false);
  }

  async function handleVerifyOtp(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setErrorText("");
    setMessage("");

    const normalizedEmail = email.trim();
    const normalizedToken = token.trim();

    if (!normalizedEmail || !normalizedToken) {
      setErrorText("이메일과 인증번호를 입력해 주세요.");
      setLoading(false);
      return;
    }

    const { error } = await supabase.auth.verifyOtp({
      email: normalizedEmail,
      token: normalizedToken,
      type: "email",
    });

    if (error) {
      setErrorText(error.message || "인증번호 확인에 실패했습니다.");
      setLoading(false);
      return;
    }

    setMessage("로그인이 완료되었습니다.");
    setLoading(false);
    setLocation(returnTo);
  }

  async function handleSocialLogin(provider: "google") {
    setLoading(true);
    setErrorText("");
    setMessage("");

    const redirectTo = `${getBaseUrl()}/`;

    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo,
      },
    });

    if (error) {
      setErrorText(error.message || "소셜 로그인에 실패했습니다.");
      setLoading(false);
      return;
    }
  }

  return (
    <div className="paper-texture">
      <section className="border-b border-ink/15">
        <div className="container py-20 md:py-28">
          <div className="grid grid-cols-1 items-end gap-10 lg:grid-cols-12">
            <div className="lg:col-span-8">
              <div className="chapter-label">Citizen · Sign In</div>
              <h1
                className="mt-6 text-[clamp(2.5rem,6vw,4.5rem)] leading-[1.05]"
                style={{ color: "var(--color-navy)" }}
              >
                시민
                <br />
                <span style={{ color: "var(--color-brick)" }}>간편 로그인</span>
              </h1>
              <p className="mt-6 max-w-2xl text-[17px] leading-[1.8] text-foreground/80">
                시민의 목소리에 제안을 등록하려면 로그인해 주세요.
                이메일 인증번호 또는 소셜 로그인으로 간편하게 로그인할 수 있습니다.
              </p>
            </div>

            <div className="lg:col-span-4">
              <div className="border-t border-ink/30 pt-6">
                <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                  Access
                </div>
                <div className="mt-4 text-sm leading-relaxed text-foreground/80">
                  로그인 후 원래 보던 페이지로 자동 이동합니다.
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
              시민 로그인
            </h2>

            <p className="mt-2 text-sm text-muted-foreground">
              이메일 인증번호, Google, 로 로그인할 수 있습니다.
            </p>

            <div className="mt-6 grid gap-3">
              <button
                type="button"
                onClick={() => void handleSocialLogin("google")}
                disabled={loading}
                className="flex w-full items-center justify-center rounded-md border border-ink/15 bg-white px-4 py-3 text-sm font-semibold text-foreground transition hover:bg-neutral-50 disabled:opacity-60"
              >
                Google로 로그인
              </button>              
            </div>

            <div className="my-6 flex items-center gap-3">
              <div className="h-px flex-1 bg-black/10" />
              <span className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                or
              </span>
              <div className="h-px flex-1 bg-black/10" />
            </div>

            {step === "email" && (
              <form onSubmit={handleSendOtp} className="space-y-4">
                <div className="grid gap-2">
                  <label htmlFor="email" className="text-sm font-medium">
                    이메일
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="rounded-md border border-ink/15 bg-white px-4 py-3 outline-none"
                    placeholder="user@example.com"
                    autoComplete="email"
                    required
                  />
                </div>

                {errorText && (
                  <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {errorText}
                  </div>
                )}

                {message && (
                  <div className="rounded-md border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                    {message}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center rounded-md px-5 py-3 text-sm font-semibold text-white disabled:opacity-60"
                  style={{ background: "var(--color-navy)" }}
                >
                  {loading ? "전송 중..." : "이메일 인증번호 받기"}
                </button>
              </form>
            )}

            {step === "otp" && (
              <form onSubmit={handleVerifyOtp} className="space-y-4">
                <div className="grid gap-2">
                  <label htmlFor="email-readonly" className="text-sm font-medium">
                    이메일
                  </label>
                  <input
                    id="email-readonly"
                    type="email"
                    value={email}
                    readOnly
                    className="rounded-md border border-ink/15 bg-neutral-50 px-4 py-3 outline-none"
                  />
                </div>

                <div className="grid gap-2">
                  <label htmlFor="otp" className="text-sm font-medium">
                    인증번호
                  </label>
                  <input
                    id="otp"
                    type="text"
                    inputMode="numeric"
                    value={token}
                    onChange={(e) =>
                      setToken(e.target.value.replace(/[^0-9]/g, "").slice(0, 6))
                    }
                    className="rounded-md border border-ink/15 bg-white px-4 py-3 outline-none"
                    placeholder="6자리 인증번호"
                    maxLength={6}
                    required
                  />
                </div>

                {errorText && (
                  <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {errorText}
                  </div>
                )}

                {message && (
                  <div className="rounded-md border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                    {message}
                  </div>
                )}

                <div className="flex flex-wrap gap-3">
                  <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex items-center rounded-md px-5 py-3 text-sm font-semibold text-white disabled:opacity-60"
                    style={{ background: "var(--color-navy)" }}
                  >
                    {loading ? "확인 중..." : "인증번호 확인"}
                  </button>

                  <button
                    type="button"
                    disabled={loading}
                    onClick={() => {
                      setStep("email");
                      setToken("");
                      setErrorText("");
                      setMessage("");
                    }}
                    className="inline-flex items-center rounded-md border border-ink/15 px-5 py-3 text-sm font-semibold text-foreground disabled:opacity-60"
                  >
                    이메일 다시 입력
                  </button>

                  <button
                    type="button"
                    disabled={loading}
                    onClick={(e) => {
                      e.preventDefault();
                      void handleSendOtp(e as unknown as React.FormEvent<HTMLFormElement>);
                    }}
                    className="inline-flex items-center rounded-md border border-ink/15 px-5 py-3 text-sm font-semibold text-foreground disabled:opacity-60"
                  >
                    인증번호 다시 받기
                  </button>
                </div>
              </form>
            )}

            <div className="mt-6 text-sm text-muted-foreground">
              관리자 로그인은{" "}
              <Link href="/admin-login" className="underline underline-offset-4">
                여기
              </Link>
              에서 할 수 있습니다.
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
