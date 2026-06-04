"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import Link from "next/link";

const supabase = createClient(
  "https://tlffsjvkyccwxdpdmcxs.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRsZmZzanZreWNjd3hkcGRtY3hzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ0MjcxNzUsImV4cCI6MjA1MDAwMzE3NX0.I839UdiUMyLrJBsf50AH7FHLqLJPMOJYeOjJogOSq9I"
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

function calcScore(c: any): number {
  let score = 50;
  const age = Number(c.age) || 0;
  if (age >= 30 && age <= 50) score += 15;
  else if (age >= 25 && age < 30) score += 8;
  else if (age > 50 && age <= 60) score += 5;
  const goodJobs = ["직장인", "공무원", "교사", "의사", "변호사", "회사원", "간호사"];
  if (goodJobs.some((j) => (c.job || "").includes(j))) score += 15;
  if (c.status === "성약완료") score += 20;
  else if (c.status === "갱신임박") score += 10;
  else if (c.status === "이탈위험") score -= 15;
  else if (c.status === "휴면") score -= 10;
  if ((c.memo || "").length > 20) score += 5;
  return Math.min(100, Math.max(0, score));
}

export default function CustomerDetail() {
  const { id } = useParams();
  const router = useRouter();
  const [customer, setCustomer] = useState<any>(null);
  const [logs, setLogs] = useState<any[]>([]);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState<any>({});
  const [newLog, setNewLog] = useState("");
  const [saving, setSaving] = useState(false);
  const [scorePreview, setScorePreview] = useState<number | null>(null);

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
    await supabase.from("customers").update(form).eq("id", id);
    setSaving(false);
    setEditing(false);
    fetchCustomer();
  }

  async function deleteCustomer() {
    if (!confirm("정말 삭제하시겠어요?")) return;
    await supabase.from("customers").delete().eq("id", id);
    router.push("/customers");
  }

  async function addLog() {
    if (!newLog.trim()) return;
    await supabase.from("consultations").insert([{ customer_id: id, content: newLog }]);
    setNewLog("");
    fetchLogs();
  }

  async function deleteLog(logId: number) {
    await supabase.from("consultations").delete().eq("id", logId);
    fetchLogs();
  }

  function applyAutoScore() {
    const s = calcScore(form);
    setForm((f: any) => ({ ...f, score: s }));
    setScorePreview(s);
  }

  if (!customer) return <div style={{ padding: "40px", color: "#94a3b8" }}>불러오는 중...</div>;

  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

  return (
    <div style={{ maxWidth: "720px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "24px", flexWrap: "wrap" }}>
        <Link href="/customers" style={{ color: "#94a3b8", fontSize: "14px", textDecoration: "none" }}>← 목록</Link>
        <h1 style={{ fontSize: "22px", fontWeight: 800, color: "#1e293b", flex: 1 }}>{customer.name}</h1>
        <span style={{ background: STATUS_COLOR[customer.status] || "#f1f5f9", color: STATUS_TEXT[customer.status] || "#64748b", borderRadius: "20px", padding: "4px 12px", fontSize: "13px", fontWeight: 600 }}>
          {customer.status}
        </span>
        <button onClick={() => setEditing(!editing)} style={{ background: editing ? "#f1f5f9" : "#4f46e5", color: editing ? "#64748b" : "#fff", border: "none", borderRadius: "8px", padding: "8px 16px", fontSize: "13px", fontWeight: 600, cursor: "pointer" }}>
          {editing ? "취소" : "✏️ 수정"}
        </button>
        <button onClick={deleteCustomer} style={{ background: "#fee2e2", color: "#dc2626", border: "none", borderRadius: "8px", padding: "8px 16px", fontSize: "13px", fontWeight: 600, cursor: "pointer" }}>
          🗑️ 삭제
        </button>
      </div>

      <div style={{ background: "#fff", borderRadius: "14px", padding: "24px", boxShadow: "0 1px 6px rgba(0,0,0,0.06)", border: "1px solid #f1f5f9", marginBottom: "20px" }}>
        <div style={{ fontWeight: 700, fontSize: "15px", color: "#1e293b", marginBottom: "16px" }}>고객 정보</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "14px" }}>
          {[
            { label: "이름", key: "name" },
            { label: "나이", key: "age" },
            { label: "직업", key: "job" },
            { label: "전화번호", key: "phone" },
          ].map(({ label, key }) => (
            <div key={key}>
              <div style={{ fontSize: "11px", color: "#94a3b8", fontWeight: 600, marginBottom: "4px", textTransform: "uppercase" }}>{label}</div>
              {editing ? (
                <input value={form[key] || ""} onChange={(e) => setForm((f: any) => ({ ...f, [key]: e.target.value }))}
                  style={{ width: "100%", border: "1px solid #e2e8f0", borderRadius: "8px", padding: "8px 10px", fontSize: "14px", boxSizing: "border-box" }} />
              ) : (
                <div style={{ fontSize: "15px", color: "#1e293b", fontWeight: 500 }}>{customer[key] || "-"}</div>
              )}
            </div>
          ))}
          <div>
            <div style={{ fontSize: "11px", color: "#94a3b8", fontWeight: 600, marginBottom: "4px", textTransform: "uppercase" }}>상태</div>
            {editing ? (
              <select value={form.status || ""} onChange={(e) => setForm((f: any) => ({ ...f, status: e.target.value }))}
                style={{ width: "100%", border: "1px solid #e2e8f0", borderRadius: "8px", padding: "8px 10px", fontSize: "14px" }}>
                {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            ) : (
              <div style={{ fontSize: "15px", color: "#1e293b", fontWeight: 500 }}>{customer.status}</div>
            )}
          </div>
          <div>
            <div style={{ fontSize: "11px", color: "#94a3b8", fontWeight: 600, marginBottom: "4px", textTransform: "uppercase" }}>성약 점수</div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
              {editing ? (
                <input type="number" min={0} max={100} value={form.score || 0}
                  onChange={(e) => setForm((f: any) => ({ ...f, score: Number(e.target.value) }))}
                  style={{ width: "80px", border: "1px solid #e2e8f0", borderRadius: "8px", padding: "8px 10px", fontSize: "14px" }} />
              ) : (
                <div style={{ fontSize: "22px", fontWeight: 800, color: (customer.score||0) >= 70 ? "#059669" : (customer.score||0) >= 50 ? "#4f46e5" : "#d97706" }}>{customer.score ?? "-"}점</div>
              )}
              {editing && (
                <button onClick={applyAutoScore} style={{ background: "linear-gradient(90deg,#4f46e5,#7c3aed)", color: "#fff", border: "none", borderRadius: "8px", padding: "8px 14px", fontSize: "12px", fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap" }}>
                  ✨ 자동계산
                </button>
              )}
              {scorePreview !== null && editing && (
                <span style={{ fontSize: "12px", color: "#7c3aed", fontWeight: 600 }}>→ {scorePreview}점 적용됨</span>
              )}
            </div>
            {editing && (
              <div style={{ fontSize: "11px", color: "#94a3b8", marginTop: "4px" }}>나이·직업·상태·메모 기반 자동계산</div>
            )}
          </div>
        </div>
        <div style={{ marginTop: "14px" }}>
          <div style={{ fontSize: "11px", color: "#94a3b8", fontWeight: 600, marginBottom: "4px", textTransform: "uppercase" }}>메모</div>
          {editing ? (
            <textarea value={form.memo || ""} onChange={(e) => setForm((f: any) => ({ ...f, memo: e.target.value }))} rows={3}
              style={{ width: "100%", border: "1px solid #e2e8f0", borderRadius: "8px", padding: "8px 10px", fontSize: "14px", boxSizing: "border-box", resize: "vertical" }} />
          ) : (
            <div style={{ fontSize: "14px", color: "#64748b" }}>{customer.memo || "메모 없음"}</div>
          )}
        </div>
        {editing && (
          <button onClick={saveCustomer} disabled={saving}
            style={{ marginTop: "16px", background: "#059669", color: "#fff", border: "none", borderRadius: "8px", padding: "10px 24px", fontSize: "14px", fontWeight: 700, cursor: "pointer", width: "100%" }}>
            {saving ? "저장 중..." : "💾 저장"}
          </button>
        )}
      </div>

      <div style={{ background: "#fff", borderRadius: "14px", padding: "24px", boxShadow: "0 1px 6px rgba(0,0,0,0.06)", border: "1px solid #f1f5f9" }}>
        <div style={{ fontWeight: 700, fontSize: "15px", color: "#1e293b", marginBottom: "16px" }}>상담 히스토리</div>
        <div style={{ display: "flex", gap: "8px", marginBottom: "16px", flexWrap: "wrap" }}>
          <textarea value={newLog} onChange={(e) => setNewLog(e.target.value)} placeholder="상담 내용 입력..." rows={2}
            style={{ flex: 1, minWidth: "200px", border: "1px solid #e2e8f0", borderRadius: "8px", padding: "8px 10px", fontSize: "14px", resize: "none" }} />
          <button onClick={addLog} style={{ background: "#4f46e5", color: "#fff", border: "none", borderRadius: "8px", padding: "8px 16px", fontSize: "13px", fontWeight: 600, cursor: "pointer", alignSelf: "flex-end" }}>추가</button>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {logs.length === 0 && <div style={{ color: "#94a3b8", fontSize: "13px" }}>상담 기록이 없어요</div>}
          {logs.map((log) => (
            <div key={log.id} style={{ background: "#f8fafc", borderRadius: "10px", padding: "12px 14px", display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "8px" }}>
              <div>
                <div style={{ fontSize: "14px", color: "#1e293b" }}>{log.content}</div>
                <div style={{ fontSize: "11px", color: "#94a3b8", marginTop: "4px" }}>{new Date(log.created_at).toLocaleString("ko-KR")}</div>
              </div>
              <button onClick={() => deleteLog(log.id)} style={{ background: "none", border: "none", color: "#cbd5e1", cursor: "pointer", fontSize: "16px", flexShrink: 0 }}>×</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
