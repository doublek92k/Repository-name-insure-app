"use client";
import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://tlffsjvkyccwxdpdmcxs.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRsZmZzanZreWNjd3hkcGRtY3hzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAwNzM1NDYsImV4cCI6MjA5NTY0OTU0Nn0.l839UdiUMyLrJBsf5OAH7FHLqLJRMOJYeOjJog0Sq9I"
);

const STATUS_COLOR: Record<string, string> = {
  "상담중": "#ede9fe", "이탈위험": "#fee2e2",
  "갱신임박": "#fef3c7", "성약완료": "#d1fae5", "휴면": "#f1f5f9"
};
const STATUS_TEXT: Record<string, string> = {
  "상담중": "#4f46e5", "이탈위험": "#dc2626",
  "갱신임박": "#d97706", "성약완료": "#059669", "휴면": "#64748b"
};

export default function Customers() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: "", age: "", job: "", phone: "", status: "상담중", score: "", memo: "" });
  const [adding, setAdding] = useState(false);
  const [filterStatus, setFilterStatus] = useState("전체");

  useEffect(() => { fetchCustomers(); }, []);

  async function fetchCustomers() {
    const { data } = await supabase.from("customers").select("*");
    if (data) setCustomers(data);
    setLoading(false);
  }

  async function addCustomer() {
    if (!form.name) return alert("이름을 입력해주세요");
    setAdding(true);
    await supabase.from("customers").insert([{
      name: form.name, age: parseInt(form.age) || null, job: form.job,
      phone: form.phone, status: form.status, score: parseInt(form.score) || 0, memo: form.memo,
    }]);
    setForm({ name: "", age: "", job: "", phone: "", status: "상담중", score: "", memo: "" });
    await fetchCustomers();
    setAdding(false);
  }

  async function deleteCustomer(name: string) {
    if (!confirm("삭제할까요?")) return;
    await supabase.from("customers").delete().eq("name", name);
    fetchCustomers();
  }

  function exportExcel() {
    const headers = ["이름", "나이", "직업", "연락처", "상태", "점수", "메모"];
    const rows = filtered.map(c => [c.name, c.age, c.job, c.phone, c.status, c.score, c.memo]);
    const csv = [headers, ...rows].map(r => r.map(v => `"${v ?? ""}"`).join(",")).join("\n");
    const BOM = "\uFEFF";
    const blob = new Blob([BOM + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `고객목록_${new Date().toLocaleDateString("ko-KR").replace(/\. /g, "-").replace(".", "")}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function sendEmail(c: any) {
    const subject = encodeURIComponent(`[InsureKit] ${c.name} 고객 안내`);
    const body = encodeURIComponent(`안녕하세요, ${c.name} 고객님.\n\n보험 관련 안내 드립니다.\n\n감사합니다.`);
    window.open(`mailto:?subject=${subject}&body=${body}`);
  }

  const filtered = filterStatus === "전체" ? customers : customers.filter(c => c.status === filterStatus);
  const statuses = ["전체", "상담중", "이탈위험", "갱신임박", "성약완료", "휴면"];

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "8px" }}>
        <h1 style={{ fontSize: "24px", fontWeight: 800, color: "#1e293b", letterSpacing: "-0.5px" }}>고객 관리</h1>
        <button onClick={exportExcel} style={{ display: "flex", alignItems: "center", gap: "6px", padding: "9px 16px", background: "#059669", color: "#fff", border: "none", borderRadius: "8px", cursor: "pointer", fontSize: "13px", fontWeight: 600 }}>
          📊 엑셀 내보내기
        </button>
      </div>
      <p style={{ color: "#64748b", fontSize: "14px", marginBottom: "28px" }}>고객 정보를 등록하고 관리하세요</p>

      {/* 입력 폼 */}
      <div style={{ background: "#fff", borderRadius: "14px", padding: "22px", boxShadow: "0 1px 6px rgba(0,0,0,0.06)", border: "1px solid #f1f5f9", marginBottom: "20px" }}>
        <h3 style={{ fontSize: "14px", fontWeight: 700, marginBottom: "14px", color: "#1e293b" }}>새 고객 추가</h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "10px", marginBottom: "10px" }}>
          {[["이름 *", "name"], ["나이", "age"], ["직업", "job"], ["연락처", "phone"], ["성약 가능성(0~100)", "score"]].map(([ph, key]) => (
            <input key={key} placeholder={ph} value={(form as any)[key]} onChange={e => setForm({ ...form, [key]: e.target.value })}
              style={{ padding: "9px 12px", border: "1px solid #e2e8f0", borderRadius: "8px", fontSize: "14px", outline: "none", color: "#1e293b" }} />
          ))}
          <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}
            style={{ padding: "9px 12px", border: "1px solid #e2e8f0", borderRadius: "8px", fontSize: "14px", color: "#1e293b" }}>
            {["상담중", "이탈위험", "갱신임박", "성약완료", "휴면"].map(s => <option key={s}>{s}</option>)}
          </select>
        </div>
        <div style={{ display: "flex", gap: "10px" }}>
          <input placeholder="메모" value={form.memo} onChange={e => setForm({ ...form, memo: e.target.value })}
            style={{ flex: 1, padding: "9px 12px", border: "1px solid #e2e8f0", borderRadius: "8px", fontSize: "14px", outline: "none" }} />
          <button onClick={addCustomer} disabled={adding}
            style={{ padding: "9px 24px", background: "#1e3a5f", color: "#fff", border: "none", borderRadius: "8px", cursor: "pointer", fontSize: "14px", fontWeight: 600 }}>
            {adding ? "추가 중..." : "+ 추가"}
          </button>
        </div>
      </div>

      {/* 필터 */}
      <div style={{ display: "flex", gap: "8px", marginBottom: "16px" }}>
        {statuses.map(s => (
          <button key={s} onClick={() => setFilterStatus(s)}
            style={{ padding: "6px 14px", borderRadius: "20px", border: "1px solid", fontSize: "13px", cursor: "pointer", fontWeight: 500,
              borderColor: filterStatus === s ? "#1e3a5f" : "#e2e8f0",
              background: filterStatus === s ? "#1e3a5f" : "#fff",
              color: filterStatus === s ? "#fff" : "#64748b" }}>
            {s} {s !== "전체" ? `(${customers.filter(c => c.status === s).length})` : `(${customers.length})`}
          </button>
        ))}
      </div>

      {/* 테이블 */}
      <div style={{ background: "#fff", borderRadius: "14px", boxShadow: "0 1px 6px rgba(0,0,0,0.06)", border: "1px solid #f1f5f9", overflow: "hidden" }}>
        {loading ? <p style={{ padding: "40px", textAlign: "center", color: "#94a3b8" }}>로딩 중...</p> : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#f8fafc" }}>
                {["이름", "나이", "직업", "연락처", "상태", "점수", "메모", "액션"].map(h => (
                  <th key={h} style={{ padding: "11px 14px", textAlign: "left", fontSize: "12px", color: "#94a3b8", fontWeight: 600 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={8} style={{ padding: "40px", textAlign: "center", color: "#94a3b8", fontSize: "14px" }}>등록된 고객이 없어요</td></tr>
              ) : filtered.map(c => (
                <tr key={c.name} style={{ borderTop: "1px solid #f1f5f9" }}>
                  <td style={{ padding: "12px 14px", fontWeight: 700, fontSize: "14px", color: "#1e293b" }}>{c.name}</td>
                  <td style={{ padding: "12px 14px", fontSize: "13px", color: "#64748b" }}>{c.age}</td>
                  <td style={{ padding: "12px 14px", fontSize: "13px", color: "#64748b" }}>{c.job}</td>
                  <td style={{ padding: "12px 14px", fontSize: "13px", color: "#64748b" }}>{c.phone}</td>
                  <td style={{ padding: "12px 14px" }}>
                    <span style={{ background: STATUS_COLOR[c.status] || "#f1f5f9", color: STATUS_TEXT[c.status] || "#64748b", padding: "3px 10px", borderRadius: "20px", fontSize: "12px", fontWeight: 600 }}>{c.status}</span>
                  </td>
                  <td style={{ padding: "12px 14px", fontSize: "13px", fontWeight: 600, color: "#1e293b" }}>{c.score}점</td>
                  <td style={{ padding: "12px 14px", fontSize: "12px", color: "#94a3b8", maxWidth: "120px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{c.memo}</td>
                  <td style={{ padding: "12px 14px" }}>
                    <div style={{ display: "flex", gap: "6px" }}>
                      <button onClick={() => sendEmail(c)} style={{ background: "#eff6ff", border: "1px solid #bfdbfe", borderRadius: "6px", padding: "4px 10px", cursor: "pointer", color: "#2563eb", fontSize: "12px", fontWeight: 600 }}>✉️ 메일</button>
                      <button onClick={() => deleteCustomer(c.name)} style={{ background: "none", border: "1px solid #e2e8f0", borderRadius: "6px", padding: "4px 8px", cursor: "pointer", color: "#94a3b8", fontSize: "12px" }}>삭제</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
