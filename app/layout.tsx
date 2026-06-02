"use client";
import "./globals.css";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV = [
  { href: "/", label: "홈 대시보드", icon: "🏠" },
  { href: "/customers", label: "고객 관리", icon: "👥" },
  { href: "/documents", label: "서류 보관함", icon: "📁" },
  { href: "/schedule", label: "일정 & 팔로업", icon: "📅" },
];

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const pathname = usePathname();

  return (
    <html lang="ko">
      <body style={{ margin: 0, fontFamily: "'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif", background: "#f0f2f8", display: "flex", minHeight: "100vh" }}>
        <aside style={{ width: "210px", minHeight: "100vh", background: "linear-gradient(180deg, #1e3a5f 0%, #16294a 100%)", color: "#fff", display: "flex", flexDirection: "column", flexShrink: 0, boxShadow: "2px 0 12px rgba(0,0,0,0.15)" }}>
          <div style={{ padding: "28px 20px 20px" }}>
            <div style={{ fontSize: "20px", fontWeight: 800, color: "#fff", letterSpacing: "-0.5px" }}>🛡️ InsureKit</div>
            <div style={{ fontSize: "11px", color: "#7fb3e8", marginTop: "5px" }}>보험영업 AI 툴킷</div>
          </div>
          <div style={{ height: "1px", background: "rgba(255,255,255,0.08)", margin: "0 16px" }} />
          <nav style={{ flex: 1, padding: "16px 10px" }}>
            {NAV.map(({ href, label, icon }) => {
              const active = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  style={{
                    display: "flex", alignItems: "center", gap: "10px",
                    padding: "10px 14px", textDecoration: "none", fontSize: "14px",
                    borderRadius: "8px", marginBottom: "4px",
                    background: active ? "rgba(255,255,255,0.15)" : "transparent",
                    color: active ? "#fff" : "#b8d4f0",
                    fontWeight: active ? 600 : 400,
                  }}
                >
                  <span style={{ fontSize: "16px" }}>{icon}</span>
                  <span>{label}</span>
                </Link>
              );
            })}
          </nav>
          <div style={{ padding: "16px 20px", borderTop: "1px solid rgba(255,255,255,0.08)", fontSize: "11px", color: "#4a7aab" }}>
            v1.1 · doublek92k
          </div>
        </aside>
        <main style={{ flex: 1, padding: "36px 40px", overflowY: "auto" }}>
          {children}
        </main>
      </body>
    </html>
  );
}
