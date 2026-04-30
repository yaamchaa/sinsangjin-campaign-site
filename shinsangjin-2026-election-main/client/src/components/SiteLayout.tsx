/**
 * Design: "The Architect of Trust" — Editorial Civic
 * SiteLayout: 상단 네비게이션 + 푸터 + 스크롤 진행도 바
 * 페이퍼 크림 배경, 네이비 네비, 세리프 로고타이프
 */
import { useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X } from "lucide-react";

const NAV_ITEMS = [
  { to: "/", label: "홈", en: "Home" },
  { to: "/about", label: "후보 소개", en: "Candidate" },
  { to: "/achievements", label: "시정 성과", en: "Achievements" },
  { to: "/pledges", label: "5대 공약", en: "Pledges" },
  { to: "/analysis", label: "유권자 분석", en: "Analysis" },
  { to: "/newsroom", label: "뉴스룸", en: "Newsroom" },
  { to: "/voice", label: "시민의 목소리", en: "Voice" },
];

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const [progress, setProgress] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);

  // Close mobile menu on route change
  useEffect(() => {
    setMenuOpen(false);
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, [location]);

  // Scroll progress bar
  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement;
      const scrolled = h.scrollTop;
      const height = h.scrollHeight - h.clientHeight;
      setProgress(height > 0 ? (scrolled / height) * 100 : 0);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // IntersectionObserver for .reveal elements
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in-view");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -60px 0px" }
    );
    const els = document.querySelectorAll(".reveal");
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [location]);

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      {/* Scroll progress */}
      <div className="fixed top-0 left-0 right-0 z-50 h-[2px] bg-transparent">
        <div
          className="h-full transition-[width] duration-150"
          style={{
            width: `${progress}%`,
            background: "linear-gradient(90deg, var(--color-navy) 0%, var(--color-brick) 100%)",
          }}
        />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-40 backdrop-blur-md bg-background/85 border-b border-ink/10">
        <div className="container flex items-center justify-between h-[72px]">
          <Link href="/" className="flex items-baseline gap-2 group">
            <span
              className="text-xl sm:text-2xl font-black tracking-tight"
              style={{ fontFamily: "var(--font-serif)", color: "var(--color-navy)" }}
            >
              신상진
            </span>
            <span className="font-editorial italic text-sm text-muted-foreground hidden sm:inline">
              Seongnam 2026
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden xl:flex items-center gap-7">
            {NAV_ITEMS.map((item) => {
              const active = location === item.to;
              return (
                <Link
                  key={item.to}
                  href={item.to}
                  className={`link-underline text-[15px] font-medium transition-colors ${
                    active ? "text-[var(--color-brick)]" : "text-foreground/80 hover:text-foreground"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
            <a
              href="#support"
              onClick={(e) => {
                e.preventDefault();
                import("sonner").then(({ toast }) =>
                  toast("후원 페이지는 준비 중입니다.", {
                    description: "곧 오픈 예정이오니 조금만 기다려 주세요.",
                  })
                );
              }}
              className="inline-flex items-center px-5 py-2 text-sm font-semibold tracking-wide transition-all"
              style={{
                background: "var(--color-navy)",
                color: "var(--color-paper)",
                letterSpacing: "0.05em",
              }}
            >
              함께하기
            </a>
          </nav>

          {/* Mobile menu button */}
          <button
            className="xl:hidden p-2 -mr-2"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="메뉴 열기"
          >
            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile nav */}
        {menuOpen && (
          <div className="xl:hidden border-t border-ink/10 bg-background">
            <nav className="container py-6 flex flex-col gap-4">
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.to}
                  href={item.to}
                  className="flex items-baseline justify-between py-2 border-b border-ink/10"
                >
                  <span className="text-lg font-serif" style={{ fontFamily: "var(--font-serif)", fontWeight: 700 }}>
                    {item.label}
                  </span>
                  <span className="font-editorial italic text-xs text-muted-foreground">
                    {item.en}
                  </span>
                </Link>
              ))}
            </nav>
          </div>
        )}
      </header>

      <main className="flex-1">{children}</main>

      {/* Footer */}
      <footer className="mt-24 border-t border-ink/15" style={{ background: "var(--color-navy)", color: "var(--color-paper)" }}>
        <div className="container py-16">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
            <div className="md:col-span-5">
              <div className="chapter-label" style={{ color: "var(--color-gold)" }}>
                Seongnam 2026 · June 3
              </div>
              <h3 className="mt-4 text-3xl md:text-4xl" style={{ color: "var(--color-paper)" }}>
                성남의 미래를<br/>완성하는 시장
              </h3>
              <p className="mt-6 text-sm leading-relaxed opacity-80 max-w-md">
                검증된 성과, 흔들리지 않는 원칙, 시민이 체감하는 변화.<br/>
                시작한 일을 끝까지 책임지는 시장, 신상진과 함께합니다.
              </p>
            </div>

            <div className="md:col-span-3">
              <div className="chapter-label" style={{ color: "var(--color-gold)" }}>Navigation</div>
              <ul className="mt-4 space-y-2 text-sm">
                {NAV_ITEMS.map((n) => (
                  <li key={n.to}>
                    <Link href={n.to} className="link-underline opacity-80 hover:opacity-100">
                      {n.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="md:col-span-4">
              <div className="chapter-label" style={{ color: "var(--color-gold)" }}>Contact</div>
              <ul className="mt-4 space-y-2 text-sm opacity-85">
                <li>경기도 성남시 중원구 성남대로 997</li>
                <li>성남시청 · 031-729-2114</li>
                <li>선거사무소 개소 예정</li>
              </ul>
              <div className="mt-6 flex gap-4 text-xs font-editorial italic opacity-60">
                <span>Instagram</span>
                <span>YouTube</span>
                <span>Facebook</span>
              </div>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-white/15 flex flex-col sm:flex-row justify-between gap-4 text-xs opacity-60">
            <div>© 2026 신상진 후보 선거운동본부 · 선거관리위원회 등록</div>
            <div className="font-editorial italic">The Architect of Trust — Seongnam 2026</div>
          </div>
        </div>
      </footer>
    </div>
  );
}
