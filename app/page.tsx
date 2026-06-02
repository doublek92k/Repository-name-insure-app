"use client";
import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://tlffsjvkyccwxdpdmcxs.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRsZmZzanZreWNjd3hkcGRtY3hzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAwNzM1NDYsImV4cCI6MjA5NTY0OTU0Nn0.l839UdiUMyLrJBsf5OAH7FHLqLJRMOJYeOjJog0Sq9I"
);

export default function Home() {
  const [customers, setCustomers] = useState<any[]>([]);

  useEffect(() => {
    supabase.from("customers").select("*").then(({ data }) => {
      if (data) setCustomers(data);
    });
  }, []);

  const total = customers.length;
  const byStatus = (s: string) => customers.filter((c) => c.status === s).length;
  const avgScore = total ? Math.round(customers.reduce((a, c) => a + (c.score || 0), 0) / total) : 0;

  const stats = [
    { label: "전체 고객", value: total + "명", color: "#1e3a5f", bg: "#e8f0fb", icon: "👥" },
    { label: "상담중", value: byStatus("상담중") + "명", color: "#4f46e5", bg: "#ede9fe", icon: "💬" },
    { label: "성약완료", value: byStatus("성약완료") + "명", color: "#059669", bg: "#d1fae5", icon: "✅" },
    { label: "이탈위험", value: byStatus("이탈위험") + "명", color: "#dc2626", bg: "#fee2e2", icon: "⚠️" },
    { label: "갱신임박", value: byStatus("갱신임박") + "명", color: "#d97706", bg: "#fef3c7", icon: "🔔" },
    { label: "평균 점수", value: avgScore + "점", color: "#7c3aed", bg: "#f3e8ff", icon: "📊" },
  ];

  const recent = [...customers].slice(-5).reverse();

  const STATUS_COLOR: Record<string, string> = {
    "상담중": "#ede9fe", "이탈위험": "#fee2e2",
    "갱신임박": "#fef3c7", "성약완료": "#d1fae5", "휴면": "#f1f5f9"
  };
  const STATUS_TEXT: Record<string, string> = {
    "상담중": "#4f46e5", "이탈위험": "#dc2626",
    "갱신임박": "#d97706", "성약완료": "#059669", "휴면": "#64748b"
  };

  return (
    <div>
      <h1 style={{ fontSize: "24px", fontWeight: 800, marginBottom: "4px", color: "#1e293b", letterSpacing: "-0.5px" }}>홈 대시보드</h1>
      <p style={{ color: "#64748b", fontSize: "14px", marginBottom: "32px" }}>오늘도 좋은 영업 되세요 👋</p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px", marginBottom: "32px" }}>
        {stats.map((s) => (
          <div key={s.label} style={{ background: "#fff", borderRadius: "14px", padding: "22px", boxShadow: "0 1px 6px rgba(0,0,0,0.06)", display: "flex", alignItems: "center", gap: "16px", border: "1px solid #f1f5f9" }}>
            <div style={{ width: "48px", height: "48px", borderRadius: "12px", background: s.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "22px", flexShrink: 0 }}>{s.icon}</div>
            <div>
              <div style={{ fontSize: "26px", fontWeight: 800, color: s.color, letterSpacing: "-0.5px" }}>{s.value}</div>
              <div style={{ fontSize: "13px", color: "#94a3b8", marginTop: "2px" }}>{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ background: "#fff", borderRadius: "14px", padding: "24px", boxShadow: "0 1px 6px rgba(0,0,0,0.06)", border: "1px solid #f1f5f9" }}>
        <h2 style={{ fontSize: "15px", fontWeight: 700, marginBottom: "16px", color: "#1e293b" }}>최근 등록 고객</h2>
        {recent.length === 0 ? (
          <p style={{ color: "#94a3b8", fontSize: "14px" }}>등록된 고객이 없어요.</p>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#f8fafc" }}>
                {["이름", "직업", "상태", "점수"].map((h) => (
                  <th key={h} style={{ padding: "10px 14px", textAlign: "left", fontSize: "12px", color: "#94a3b8", fontWeight: 600, letterSpacing: "0.3px" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {recent.map((c) => (
                <tr key={c.name} style={{ borderTop: "1px solid #f1f5f9" }}>
                  <td style={{ padding: "12px 14px", fontSize: "14px", fontWeight: 600, color: "#1e293b" }}>{c.name}</td>
                  <td style={{ padding: "12px 14px", fontSize: "13px", color: "#64748b" }}>{c.job}</td>
                  <td style={{ padding: "12px 14px" }}>
                    <span style={{ background: STATUS_COLOR[c.status] || "#f1f5f9", color: STATUS_TEXT[c.status] || "#64748b", padding: "3px 10px", borderRadius: "20px", fontSize: "12px", fontWeight: 600 }}>{c.status}</span>
                  </td>
                  <td style={{ padding: "12px 14px", fontSize: "13px", color: "#64748b", fontWeight: 600 }}>{c.score}점</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
