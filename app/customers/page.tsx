"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

const STATUS_COLOR: Record<string, string> = {
  "상담중": "#ede9fe", "이탈위험": "#fee2e2",
  "갱신임박": "#fef3c7", "성약완료": "#d1fae5", "휴면": "#f1f5f9"
};
const STATUS_TEXT: Record<string, string> = {
  "상담중": "#4f46e5", "이탈위험": "#dc2626",
  "갱신임박": "#d97706", "성약완료": "#059669", "휴면": "#64748b"
};

export default function Customers() {
  const router = useRouter();
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: "", age: "", job: "", phone: "", status: "상담중", score: "", memo: "" });
  const [adding, setAdding] = useState(false);
  const [filterStatus, setFilterStatus] = useState("전체");

  useEffect(() => { fetchCustomers(); }, []);

  async function fetchCustomers() {
    const { data } = await supabase.from("customers").select("*").order("id", { ascending: false });
    if (data) setCustomers(data);
    setLoading(false);
  }

  async function addCustomer() {
    if (!form.name) return alert("이름을 입력하세요");
    setAdding(true);
    await supabase.from("customers").insert([{ ...form, age: Number(form.age) || null, score: Number(form.score) || 0 }]);
    setForm({ name: "", age: "", job: "", phone: "", status: "상담중", score: "", memo: "" });
    await fetchCustomers();
    setAdding(false);
  }

  async function exportExcel() {
    const headers = ["이름", "나이", "직업", "전화번호", "상태", "점수", "메모"];
    const rows = customers.map((c) => [c.name, c.age, c.job, c.phone, c.status, c.score, c.memo]);
    const csvContent = [headers, ...rows].map((r) => r.map((v) => `"${v ?? ""}"`).join(",")).join("\n");
    const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "고객목록.csv"; a.click();
  }

  const filtered = filterStatus === "전체" ? customers : customers.filter((c) => c.status === filterStatus);
  const statuses = ["전체", "상담중", "이탈위험", "갱신임박", "성약완료", "휴면"];

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "24px", flexWrap: "wrap", gap: "12px" }}>
        <div>
          <h1 style={{ fontSize: "22px", fontWeight: 800, color: "#1e293b", margin: 0 }}>👥 고객 관리</h1>
          <p style={{ color: "#64748b", fontSize: "14px", marginTop: "4px" }}>전체 {customers.length}명</p>
        </div>
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
          <button onClick={exportExcel} style={{ background: "#f0fdf4", color: "#059669", border: "1px solid #bbf7d0", borderRadius: "8px", padding: "8px 16px", fontSize: "13px", fontWeight: 600, cursor: "pointer" }}>📊 엑셀 내보내기</button>
          <button onClick={() => setAdding(!adding)} style={{ background: adding ? "#f1f5f9" : "#4f46e5", color: adding ? "#64748b" : "#fff", border: "none", borderRadius: "8px", padding: "8px 16px", fontSize: "13px", fontWeight: 600, cursor: "pointer" }}>{adding ? "취소" : "+ 고객 추가"}</button>
        </div>
      </div>

      {adding && (
        <div style={{ background: "#fff", borderRadius: "14px", padding: "20px", boxShadow: "0 1px 6px rgba(0,0,0,0.06)", border: "1px solid #f1f5f9", marginBottom: "20px" }}>
          <div style={{ fontWeight: 700, fontSize: "14px", color: "#1e293b", marginBottom: "14px" }}>새 고객 등록</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "10px", marginBottom: "12px" }}>
            {[{ p: "이름 *", k: "name" }, { p: "나이", k: "age" }, { p: "직업", k: "job" }, { p: "전화번호", k: "phone" }, { p: "점수(0-100)", k: "score" }].map(({ p, k }) => (
              <input key={k} placeholder={p} value={(form as any)[k]} onChange={(e) => setForm((f) => ({ ...f, [k]: e.target.value }))} style={{ border: "1px solid #e2e8f0", borderRadius: "8px", padding: "9px 12px", fontSize: "14px" }} />
            ))}
            <select value={form.status} onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))} style={{ border: "1px solid #e2e8f0", borderRadius: "8px", padding: "9px 12px", fontSize: "14px" }}>
              {["상담중", "이탈위험", "갱신임박", "성약완료", "휴면"].map((s) => <option key={s}>{s}</option>)}
            </select>
          </div>
          <input placeholder="메모" value={form.memo} onChange={(e) => setForm((f) => ({ ...f, memo: e.target.value }))} style={{ width: "100%", border: "1px solid #e2e8f0", borderRadius: "8px", padding: "9px 12px", fontSize: "14px", boxSizing: "border-box", marginBottom: "12px" }} />
          <button onClick={addCustomer} style={{ background: "#4f46e5", color: "#fff", border: "none", borderRadius: "8px", padding: "10px 24px", fontSize: "14px", fontWeight: 700, cursor: "pointer" }}>저장</button>
        </div>
      )}

      <div style={{ display: "flex", gap: "8px", marginBottom: "16px", flexWrap: "wrap" }}>
        {statuses.map((s) => (
          <button key={s} onClick={() => setFilterStatus(s)} style={{ background: filterStatus === s ? "#4f46e5" : "#fff", color: filterStatus === s ? "#fff" : "#64748b", border: "1px solid " + (filterStatus === s ? "#4f46e5" : "#e2e8f0"), borderRadius: "20px", padding: "5px 14px", fontSize: "13px", fontWeight: 600, cursor: "pointer" }}>{s}</button>
        ))}
      </div>

      <div style={{ background: "#fff", borderRadius: "14px", padding: "0", boxShadow: "0 1px 6px rgba(0,0,0,0.06)", border: "1px solid #f1f5f9", overflow: "hidden" }}>
        {loading ? <div style={{ padding: "40px", textAlign: "center", color: "#94a3b8" }}>불러오는 중...</div> : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid #f1f5f9", background: "#fafafa" }}>
                {["이름", "나이", "직업", "전화번호", "상태", "점수"].map((h) => <th key={h} style={{ textAlign: "left", padding: "12px 16px", fontSize: "12px", color: "#94a3b8", fontWeight: 600 }}>{h}</th>)}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && <tr><td colSpan={6} style={{ padding: "40px", textAlign: "center", color: "#94a3b8", fontSize: "14px" }}>고객이 없어요</td></tr>}
              {filtered.map((c) => (
                <tr key={c.id} onClick={() => router.push(`/customers/${c.id}`)} style={{ borderBottom: "1px solid #f8fafc", cursor: "pointer" }} onMouseEnter={(e) => (e.currentTarget.style.background = "#f8fafc")} onMouseLeave={(e) => (e.currentTarget.style.background = "")}>
                  <td style={{ padding: "14px 16px", fontSize: "14px", fontWeight: 700, color: "#1e293b" }}>{c.name}</td>
                  <td style={{ padding: "14px 16px", fontSize: "14px", color: "#64748b" }}>{c.age || "-"}</td>
                  <td style={{ padding: "14px 16px", fontSize: "14px", color: "#64748b" }}>{c.job || "-"}</td>
                  <td style={{ padding: "14px 16px", fontSize: "14px", color: "#64748b" }}>{c.phone || "-"}</td>
                  <td style={{ padding: "14px 16px" }}>
                    <span style={{ background: STATUS_COLOR[c.status] || "#f1f5f9", color: STATUS_TEXT[c.status] || "#64748b", borderRadius: "20px", padding: "3px 10px", fontSize: "12px", fontWeight: 600 }}>{c.status}</span>
                  </td>
                  <td style={{ padding: "14px 16px", fontSize: "14px", color: "#64748b" }}>{c.score}점</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
