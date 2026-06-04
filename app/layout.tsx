"use client";
import "./globals.css";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const NAV = [
  { href: "/", label: "홈 대시보드", icon: "🏠" },
  { href: "/customers", label: "고객 관리", icon: "👥" },
  { href: "/documents", label: "서류 보관함", icon: "📁" },
  { href: "/schedule", label: "일정 & 팔로업", icon: "📋" },
];

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <html lang="ko">
      <body style={{ margin: 0, fontFamily: "'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif", background: "#f0f2f8", display: "flex", flexDirection: "column", minHeight: "100vh" }}>
        {/* 모바일 상단 헤더 */}
        <header style={{ display: "none", position: "fixed", top: 0, left: 0, right: 0, height: "56px", background: "linear-gradient(135deg, #1e3a5f 0%, #16294a 100%)", zIndex: 200, alignItems: "center", padding: "0 16px", gap: "12px" }} className="mobile-header">
          <button onClick={() => setMobileOpen(!mobileOpen)} style={{ background: "none", border: "none", color: "#fff", fontSize: "22px", cursor: "pointer", padding: "4px" }}>☰</button>
          <span style={{ color: "#fff", fontWeight: 800, fontSize: "16px" }}>🛡 InsureKit</span>
        </header>

        <div style={{ display: "flex", flex: 1 }}>
          {/* 모바일 오버레이 */}
          {mobileOpen && (
            <div onClick={() => setMobileOpen(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 150 }} className="mobile-overlay" />
          )}

          {/* 사이드바 */}
          <aside className={`sidebar ${mobileOpen ? "sidebar-open" : ""}`} style={{ width: "210px", minHeight: "100vh", background: "linear-gradient(180deg, #1e3a5f 0%, #16294a 100%)", color: "#fff", display: "flex", flexDirection: "column", flexShrink: 0 }}>
            <div style={{ padding: "28px 20px 20px" }}>
              <div style={{ fontSize: "20px", fontWeight: 800, color: "#fff", letterSpacing: "-0.5px" }}>🛡 InsureKit</div>
              <div style={{ fontSize: "11px", color: "#7fb3e8", marginTop: "5px" }}>보험영업 AI 툴킷</div>
            </div>
            <div style={{ height: "1px", background: "rgba(255,255,255,0.08)", margin: "0 16px" }} />
            <nav style={{ flex: 1, padding: "16px 10px" }}>
              {NAV.map(({ href, label, icon }) => {
                const active = pathname === href || (href !== "/" && pathname.startsWith(href));
                return (
                  <Link key={href} href={href} onClick={() => setMobileOpen(false)} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px 14px", textDecoration: "none", fontSize: "14px", borderRadius: "8px", marginBottom: "4px", background: active ? "rgba(255,255,255,0.15)" : "transparent", color: active ? "#fff" : "rgba(255,255,255,0.7)", fontWeight: active ? 700 : 400 }}>
                    <span style={{ fontSize: "17px", flexShrink: 0 }}>{icon}</span>
                    {label}
                  </Link>
                );
              })}
            </nav>
            <div style={{ padding: "16px 20px", fontSize: "11px", color: "rgba(255,255,255,0.3)" }}>v1.2 · doublek92k</div>
          </aside>

          {/* 메인 컨텐츠 */}
          <main style={{ flex: 1, padding: "32px 28px", maxWidth: "100%", boxSizing: "border-box" }} className="main-content">
            {children}
          </main>
        </div>

        <style>{`
          @media (max-width: 768px) {
            .mobile-header { display: flex !important; }
            .main-content { padding: 72px 16px 24px !important; }
            .sidebar {
              position: fixed !important;
              top: 0; left: 0; bottom: 0;
              z-index: 160;
              transform: translateX(-100%);
              transition: transform 0.25s ease;
            }
            .sidebar-open { transform: translateX(0) !important; }
          }
        `}</style>
      </body>
    </html>
  );
}
