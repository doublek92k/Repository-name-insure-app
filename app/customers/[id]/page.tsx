"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import Link from "next/link";

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
const STATUSES = ["상담중", "이탈위험", "갱신임박", "성약완료", "휴면"];

export default function CustomerDetail() {
  const { id } = useParams();
  const router = useRouter();
  const [customer, setCustomer] = useState<any>(null);
  const [logs, setLogs] = useState<any[]>([]);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState<any>({});
  const [newLog, setNewLog] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => { fetchCustomer(); fetchLogs(); }, [id]);

  async function fetchCustomer() {
    const { data } = await supabase.from("customers").select("*").eq("id", id).single();
    if (data) { setCustomer(data); setForm(data); }
  }

  async function fetchLogs() {
    const { data } = await supabase.from("consultations").select("*").eq("customer_id", id).order("created_at", { ascending: false });
    if (data) setLogs(data);
  }

  async function saveCustomer() {
    setSaving(true);
    await supabase.from("customers").update({
      name: form.name, age: form.age, job: form.job,
      phone: form.phone, status: form.status, score: form.score, memo: form.memo,
    }).eq("id", id);
    await fetchCustomer();
    setEditing(false);
    setSaving(false);
  }

  async function addLog() {
    if (!newLog.trim()) return;
    await supabase.from("consultations").insert([{ customer_id: id, content: newLog }]);
    setNewLog("");
    fetchLogs();
  }

  async function deleteLog(logId: number) {
    if (!confirm("삭제할까요?")) return;
    await supabase.from("consultations").delete().eq("id", logId);
    fetchLogs();
  }

  async function deleteCustomer() {
    if (!confirm(`${customer.name} 고객을 삭제할까요?`)) return;
    await supabase.from("consultations").delete().eq("customer_id", id);
    await supabase.from("customers").delete().eq("id", id);
    router.push("/customers");
  }

  if (!customer) return <div style={{ padding: "40px", color: "#94a3b8" }}>로딩 중...</div>;

  return (
    <div style={{ maxWidth: "860px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "28px" }}>
        <Link href="/customers" style={{ color: "#94a3b8", textDecoration: "none", fontSize: "14px" }}>← 고객 목록</Link>
      </div>

      <div style={{ background: "#fff", borderRadius: "16px", padding: "28px", boxShadow: "0 1px 6px rgba(0,0,0,0.06)", border: "1px solid #f1f5f9", marginBottom: "20px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "24px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <div style={{ width: "56px", height: "56px", borderRadius: "16px", background: "linear-gradient(135deg, #1e3a5f, #3b6fa0)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "22px", color: "#fff", fontWeight: 700 }}>
              {customer.name?.[0]}
            </div>
            <div>
              {editing ? (
                <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                  style={{ fontSize: "22px", fontWeight: 800, border: "1px solid #e2e8f0", borderRadius: "8px", padding: "4px 10px", color: "#1e293b" }} />
              ) : (
                <h1 style={{ fontSize: "22px", fontWeight: 800, color: "#1e293b", margin: 0 }}>{customer.name}</h1>
              )}
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "6px" }}>
                {editing ? (
                  <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}
                    style={{ padding: "3px 10px", borderRadius: "20px", border: "1px solid #e2e8f0", fontSize: "13px" }}>
                    {STATUSES.map(s => <option key={s}>{s}</option>)}
                  </select>
                ) : (
                  <span style={{ background: STATUS_COLOR[customer.status] || "#f1f5f9", color: STATUS_TEXT[customer.status] || "#64748b", padding: "3px 12px", borderRadius: "20px", fontSize: "13px", fontWeight: 600 }}>
                    {customer.status}
                  </span>
                )}
              </div>
            </div>
          </div>
          <div style={{ display: "flex", gap: "8px" }}>
            {editing ? (
              <>
                <button onClick={saveCustomer} disabled={saving} style={{ padding: "8px 18px", background: "#1e3a5f", color: "#fff", border: "none", borderRadius: "8px", cursor: "pointer", fontSize: "13px", fontWeight: 600 }}>{saving ? "저장 중..." : "✓ 저장"}</button>
                <button onClick={() => { setEditing(false); setForm(customer); }} style={{ padding: "8px 14px", background: "#f1f5f9", color: "#64748b", border: "none", borderRadius: "8px", cursor: "pointer", fontSize: "13px" }}>취소</button>
              </>
            ) : (
              <>
                <button onClick={() => setEditing(true)} style={{ padding: "8px 16px", background: "#f1f5f9", color: "#1e293b", border: "none", borderRadius: "8px", cursor: "pointer", fontSize: "13px", fontWeight: 600 }}>✏️ 수정</button>
                <button onClick={() => window.open(`mailto:?subject=${encodeURIComponent(`[InsureKit] ${customer.name} 고객 안내`)}&body=${encodeURIComponent(`안녕하세요, ${customer.name} 고객님.\n\n보험 관련 안내 드립니다.\n\n감사합니다.`)}`)}
                  style={{ padding: "8px 16px", background: "#eff6ff", color: "#2563eb", border: "1px solid #bfdbfe", borderRadius: "8px", cursor: "pointer", fontSize: "13px", fontWeight: 600 }}>✉️ 메일</button>
                <button onClick={deleteCustomer} style={{ padding: "8px 14px", background: "#fff", color: "#dc2626", border: "1px solid #fecaca", borderRadius: "8px", cursor: "pointer", fontSize: "13px" }}>삭제</button>
              </>
            )}
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px" }}>
          {[["나이", "age", "number"], ["직업", "job", "text"], ["연락처", "phone", "text"]].map(([label, key, type]) => (
            <div key={key} style={{ background: "#f8fafc", borderRadius: "10px", padding: "14px 16px" }}>
              <div style={{ fontSize: "11px", color: "#94a3b8", fontWeight: 600, marginBottom: "6px" }}>{label}</div>
              {editing ? (
                <input type={type} value={form[key] || ""} onChange={e => setForm({ ...form, [key]: e.target.value })}
                  style={{ width: "100%", border: "1px solid #e2e8f0", borderRadius: "6px", padding: "4px 8px", fontSize: "14px", boxSizing: "border-box" }} />
              ) : (
                <div style={{ fontSize: "15px", fontWeight: 600, color: "#1e293b" }}>{customer[key] || "-"}</div>
              )}
            </div>
          ))}
        </div>

        <div style={{ marginTop: "16px", background: "#f8fafc", borderRadius: "10px", padding: "14px 16px" }}>
          <div style={{ fontSize: "11px", color: "#94a3b8", fontWeight: 600, marginBottom: "6px" }}>메모</div>
          {editing ? (
            <textarea value={form.memo || ""} onChange={e => setForm({ ...form, memo: e.target.value })}
              style={{ width: "100%", border: "1px solid #e2e8f0", borderRadius: "6px", padding: "8px", fontSize: "14px", resize: "vertical", minHeight: "60px", boxSizing: "border-box" }} />
          ) : (
            <div style={{ fontSize: "14px", color: "#1e293b" }}>{customer.memo || "-"}</div>
          )}
        </div>
      </div>

      <div style={{ background: "#fff", borderRadius: "16px", padding: "24px", boxShadow: "0 1px 6px rgba(0,0,0,0.06)", border: "1px solid #f1f5f9" }}>
        <h2 style={{ fontSize: "16px", fontWeight: 700, color: "#1e293b", marginBottom: "16px" }}>📝 상담 히스토리</h2>
        <div style={{ display: "flex", gap: "8px", marginBottom: "20px" }}>
          <input value={newLog} onChange={e => setNewLog(e.target.value)} onKeyDown={e => e.key === "Enter" && addLog()}
            placeholder="상담 내용 입력 (Enter로 저장)"
            style={{ flex: 1, padding: "10px 14px", border: "1px solid #e2e8f0", borderRadius: "8px", fontSize: "14px", outline: "none" }} />
          <button onClick={addLog} style={{ padding: "10px 20px", background: "#1e3a5f", color: "#fff", border: "none", borderRadius: "8px", cursor: "pointer", fontSize: "14px", fontWeight: 600 }}>+ 기록</button>
        </div>
        {logs.length === 0 ? (
          <p style={{ color: "#94a3b8", fontSize: "14px", textAlign: "center", padding: "30px 0" }}>아직 상담 기록이 없어요</p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {logs.map(log => (
              <div key={log.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", padding: "14px 16px", background: "#f8fafc", borderRadius: "10px", borderLeft: "3px solid #1e3a5f" }}>
                <div>
                  <div style={{ fontSize: "14px", color: "#1e293b", lineHeight: "1.5" }}>{log.content}</div>
                  <div style={{ fontSize: "12px", color: "#94a3b8", marginTop: "6px" }}>{new Date(log.created_at).toLocaleString("ko-KR")}</div>
                </div>
                <button onClick={() => deleteLog(log.id)} style={{ background: "none", border: "none", color: "#cbd5e1", cursor: "pointer", fontSize: "18px", marginLeft: "8px" }}>×</button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
