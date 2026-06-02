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
    { label: "전체 고객", value: total + "명", color: "#3b82f6", icon: "👥" },
    { label: "상담중", value: byStatus("상담중") + "명", color: "#8b5cf6", icon: "💬" },
    { label: "성약완료", value: byStatus("성약완료") + "명", color: "#10b981", icon: "✅" },
    { label: "이탈위험", value: byStatus("이탈위험") + "명", color: "#ef4444", icon: "⚠️" },
    { label: "갱신임박", value: byStatus("갱신임박") + "명", color: "#f59e0b", icon: "🔔" },
    { label: "평균 점수", value: avgScore + "점", color: "#6366f1", icon: "📊" },
  ];

  const recent = [...customers].slice(-5).reverse();

  return (
    <div>
      <h1 style={{ fontSize: "22px", fontWeight: 700, marginBottom: "6px", color: "#111827" }}>홈 대시보드</h1>
      <p style={{ color: "#6b7280", fontSize: "14px", marginBottom: "28px" }}>오늘도 좋은 영업 되세요 👋</p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px", marginBottom: "32px" }}>
        {stats.map((s) => (
          <div key={s.label} style={{ background: "#fff", borderRadius: "12px", padding: "20px", boxShadow: "0 1px 4px rgba(0,0,0,0.06)", display: "flex", alignItems: "center", gap: "14px" }}>
            <div style={{ fontSize: "28px" }}>{s.icon}</div>
            <div>
              <div style={{ fontSize: "22px", fontWeight: 700, color: s.color }}>{s.value}</div>
              <div style={{ fontSize: "13px", color: "#6b7280" }}>{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ background: "#fff", borderRadius: "12px", padding: "24px", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
        <h2 style={{ fontSize: "15px", fontWeight: 600, marginBottom: "16px", color: "#111827" }}>최근 등록 고객</h2>
        {recent.length === 0 ? (
          <p style={{ color: "#9ca3af", fontSize: "14px" }}>등록된 고객이 없어요.</p>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#f9fafb" }}>
                {["이름", "직업", "상태", "점수"].map((h) => (
                  <th key={h} style={{ padding: "10px 12px", textAlign: "left", fontSize: "12px", color: "#6b7280", fontWeight: 500 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {recent.map((c) => (
                <tr key={c.name} style={{ borderTop: "1px solid #f3f4f6" }}>
                  <td style={{ padding: "10px 12px", fontSize: "14px", fontWeight: 500 }}>{c.name}</td>
                  <td style={{ padding: "10px 12px", fontSize: "13px", color: "#6b7280" }}>{c.job}</td>
                  <td style={{ padding: "10px 12px" }}>
                    <span style={{ background: "#f3f4f6", padding: "2px 8px", borderRadius: "4px", fontSize: "12px" }}>{c.status}</span>
                  </td>
                  <td style={{ padding: "10px 12px", fontSize: "13px", color: "#6b7280" }}>{c.score}점</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
