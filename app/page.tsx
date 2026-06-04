"use client";
import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://tlffsjvkyccwxdpdmcxs.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRsZmZzanZreWNjd3hkcGRtY3hzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ0MjcxNzUsImV4cCI6MjA1MDAwMzE3NX0.I839UdiUMyLrJBsf50AH7FHLqLJPMOJYeOjJogOSq9I"
);

export default function Home() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [followups, setFollowups] = useState<any[]>([]);

  useEffect(() => {
    supabase.from("customers").select("*").then(({ data }) => {
      if (data) setCustomers(data);
    });
    const today = new Date().toISOString().split("T")[0];
    supabase.from("schedule").select("*").eq("date", today).eq("done", false).then(({ data }) => {
      if (data) setFollowups(data);
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

  const pieData = [
    { label: "상담중", count: byStatus("상담중"), color: "#4f46e5" },
    { label: "성약완료", count: byStatus("성약완료"), color: "#059669" },
    { label: "이탈위험", count: byStatus("이탈위험"), color: "#dc2626" },
    { label: "갱신임박", count: byStatus("갱신임박"), color: "#d97706" },
    { label: "휴면", count: byStatus("휴면"), color: "#94a3b8" },
  ].filter((d) => d.count > 0);

  const PieChart = () => {
    const size = 160, cx = size / 2, cy = size / 2, r = 60;
    const totalCount = pieData.reduce((a, b) => a + b.count, 0);
    if (totalCount === 0) return <div style={{ color: "#94a3b8", fontSize: "13px" }}>데이터 없음</div>;
    let startAngle = -Math.PI / 2;
    const slices = pieData.map((d) => {
      const angle = (d.count / totalCount) * 2 * Math.PI;
      const x1 = cx + r * Math.cos(startAngle);
      const y1 = cy + r * Math.sin(startAngle);
      const x2 = cx + r * Math.cos(startAngle + angle);
      const y2 = cy + r * Math.sin(startAngle + angle);
      const largeArc = angle > Math.PI ? 1 : 0;
      const path = `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2} Z`;
      const slice = { ...d, path };
      startAngle += angle;
      return slice;
    });
    return (
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {slices.map((s, i) => (
          <path key={i} d={s.path} fill={s.color} stroke="#fff" strokeWidth={2} />
        ))}
        <circle cx={cx} cy={cy} r={30} fill="#fff" />
        <text x={cx} y={cy - 4} textAnchor="middle" fontSize="11" fill="#64748b">전체</text>
        <text x={cx} y={cy + 12} textAnchor="middle" fontSize="14" fontWeight="700" fill="#1e293b">{totalCount}명</text>
      </svg>
    );
  };

  const barData = [...customers]
    .sort((a, b) => (b.score || 0) - (a.score || 0))
    .slice(0, 6)
    .map((c) => ({ name: c.name, score: c.score || 0 }));

  return (
    <div>
      <h1 style={{ fontSize: "24px", fontWeight: 800, marginBottom: "4px", color: "#1e293b", letterSpacing: "-0.5px" }}>홈 대시보드</h1>
      <p style={{ color: "#64748b", fontSize: "14px", marginBottom: "24px" }}>오늘도 좋은 영업 되세요 🔥</p>

      {followups.length > 0 && (
        <div style={{
          background: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)",
          borderRadius: "14px", padding: "16px 24px", marginBottom: "24px",
          display: "flex", alignItems: "center", gap: "14px",
          boxShadow: "0 4px 14px rgba(79,70,229,0.3)"
        }}>
          <div style={{ fontSize: "28px" }}>🔔</div>
          <div>
            <div style={{ color: "#fff", fontWeight: 700, fontSize: "15px" }}>오늘 팔로업 {followups.length}건이 있어요!</div>
            <div style={{ color: "rgba(255,255,255,0.8)", fontSize: "13px", marginTop: "2px" }}>
              {followups.map((f) => f.customer).join(", ")} — 잊지 말고 연락해 보세요
            </div>
          </div>
          <div style={{ marginLeft: "auto" }}>
            <a href="/schedule" style={{
              background: "rgba(255,255,255,0.2)", color: "#fff", borderRadius: "8px",
              padding: "6px 14px", fontSize: "13px", fontWeight: 600,
              textDecoration: "none", border: "1px solid rgba(255,255,255,0.3)"
            }}>일정 보기 →</a>
          </div>
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px", marginBottom: "28px" }}>
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

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1.6fr", gap: "20px", marginBottom: "28px" }}>
        <div style={{ background: "#fff", borderRadius: "14px", padding: "24px", boxShadow: "0 1px 6px rgba(0,0,0,0.06)", border: "1px solid #f1f5f9" }}>
          <div style={{ fontWeight: 700, fontSize: "15px", color: "#1e293b", marginBottom: "16px" }}>상태별 고객 분포</div>
          <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
            <PieChart />
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {pieData.map((d) => (
                <div key={d.label} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: d.color, flexShrink: 0 }} />
                  <span style={{ fontSize: "12px", color: "#64748b" }}>{d.label}</span>
                  <span style={{ fontSize: "12px", fontWeight: 700, color: "#1e293b", marginLeft: "auto" }}>{d.count}명</span>
                </div>
              ))}
              {pieData.length === 0 && <div style={{ fontSize: "12px", color: "#94a3b8" }}>데이터 없음</div>}
            </div>
          </div>
        </div>

        <div style={{ background: "#fff", borderRadius: "14px", padding: "24px", boxShadow: "0 1px 6px rgba(0,0,0,0.06)", border: "1px solid #f1f5f9" }}>
          <div style={{ fontWeight: 700, fontSize: "15px", color: "#1e293b", marginBottom: "16px" }}>성약 가능성 TOP 6 (점수 기준)</div>
          {barData.length === 0 ? (
            <div style={{ color: "#94a3b8", fontSize: "13px" }}>고객 데이터 없음</div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {barData.map((d, i) => (
                <div key={d.name} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <div style={{ width: "20px", fontSize: "12px", color: "#94a3b8", textAlign: "right", flexShrink: 0 }}>{i + 1}</div>
                  <div style={{ width: "52px", fontSize: "12px", color: "#374151", fontWeight: 600, flexShrink: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{d.name}</div>
                  <div style={{ flex: 1, background: "#f1f5f9", borderRadius: "6px", height: "18px", overflow: "hidden" }}>
                    <div style={{
                      width: `${d.score}%`, height: "100%", borderRadius: "6px",
                      background: d.score >= 80 ? "linear-gradient(90deg,#059669,#34d399)" : d.score >= 60 ? "linear-gradient(90deg,#4f46e5,#818cf8)" : "linear-gradient(90deg,#d97706,#fbbf24)"
                    }} />
                  </div>
                  <div style={{ width: "36px", fontSize: "12px", fontWeight: 700, color: "#1e293b", textAlign: "right", flexShrink: 0 }}>{d.score}점</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div style={{ background: "#fff", borderRadius: "14px", padding: "24px", boxShadow: "0 1px 6px rgba(0,0,0,0.06)", border: "1px solid #f1f5f9" }}>
        <div style={{ fontWeight: 700, fontSize: "15px", color: "#1e293b", marginBottom: "16px" }}>최근 등록 고객</div>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid #f1f5f9" }}>
              {["이름", "직업", "상태", "점수"].map((h) => (
                <th key={h} style={{ textAlign: "left", padding: "8px 12px", fontSize: "12px", color: "#94a3b8", fontWeight: 600 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {recent.map((c) => (
              <tr key={c.id} style={{ borderBottom: "1px solid #f8fafc" }}>
                <td style={{ padding: "12px 12px", fontSize: "14px", fontWeight: 600, color: "#1e293b" }}>{c.name}</td>
                <td style={{ padding: "12px 12px", fontSize: "14px", color: "#64748b" }}>{c.job}</td>
                <td style={{ padding: "12px 12px" }}>
                  <span style={{ background: STATUS_COLOR[c.status] || "#f1f5f9", color: STATUS_TEXT[c.status] || "#64748b", borderRadius: "20px", padding: "3px 10px", fontSize: "12px", fontWeight: 600 }}>
                    {c.status}
                  </span>
                </td>
                <td style={{ padding: "12px 12px", fontSize: "14px", color: "#64748b" }}>{c.score}점</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
