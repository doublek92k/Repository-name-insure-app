import type { Metadata } from "next";
import "./globals.css";
import Link from "next/link";

export const metadata: Metadata = {
  title: "InsureKit - 보험영업 AI 툴킷",
  description: "보험 영업사원을 위한 AI 통합 관리 툴",
};

const NAV = [
  { href: "/", label: "🏠 홈 대시보드" },
  { href: "/customers", label: "👥 고객 관리" },
  { href: "/consulting", label: "🤖 상담 AI" },
  { href: "/documents", label: "📁 서류 보관함" },
  { href: "/schedule", label: "📅 일정 & 팔로업" },
];

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko">
      <body style={{ margin: 0, fontFamily: "sans-serif", background: "#f5f6fa", display: "flex", minHeight: "100vh" }}>
        <aside style={{ width: "220px", minHeight: "100vh", background: "#111827", color: "#fff", display: "flex", flexDirection: "column", flexShrink: 0 }}>
          <div style={{ padding: "24px 20px 16px", borderBottom: "1px solid #1f2937" }}>
            <div style={{ fontSize: "18px", fontWeight: 700, color: "#fff" }}>🛡️ InsureKit</div>
            <div style={{ fontSize: "11px", color: "#6b7280", marginTop: "4px" }}>보험영업 AI 툴킷</div>
          </div>
          <nav style={{ flex: 1, padding: "12px 0" }}>
            {NAV.map(({ href, label }) => (
              <Link key={href} href={href} style={{ display: "block", padding: "11px 20px", color: "#d1d5db", textDecoration: "none", fontSize: "14px" }}>
                {label}
              </Link>
            ))}
          </nav>
          <div style={{ padding: "16px 20px", borderTop: "1px solid #1f2937", fontSize: "11px", color: "#4b5563" }}>v1.0 · doublek92k</div>
        </aside>
        <main style={{ flex: 1, padding: "32px", overflowY: "auto" }}>
          {children}
        </main>
      </body>
    </html>
  );
}
