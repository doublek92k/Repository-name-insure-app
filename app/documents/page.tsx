"use client";
import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://tlffsjvkyccwxdpdmcxs.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRsZmZzanZreWNjd3hkcGRtY3hzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAwNzM1NDYsImV4cCI6MjA5NTY0OTU0Nn0.l839UdiUMyLrJBsf5OAH7FHLqLJRMOJYeOjJog0Sq9I"
);

export default function Documents() {
  const [docs, setDocs] = useState<any[]>([]);
  const [form, setForm] = useState({ customer: "", type: "청약서", memo: "" });
  const [adding, setAdding] = useState(false);

  useEffect(() => { fetchDocs(); }, []);

  async function fetchDocs() {
    const { data } = await supabase.from("documents").select("*").order("created_at", { ascending: false });
    if (data) setDocs(data);
  }

  async function addDoc() {
    if (!form.customer) return alert("고객명을 입력하세요");
    setAdding(true);
    await supabase.from("documents").insert([{ customer: form.customer, type: form.type, memo: form.memo }]);
    setForm({ customer: "", type: "청약서", memo: "" });
    await fetchDocs();
    setAdding(false);
  }

  async function deleteDoc(id: number) {
    if (!confirm("삭제할까요?")) return;
    await supabase.from("documents").delete().eq("id", id);
    fetchDocs();
  }

  const DOC_TYPES = ["청약서", "설계서", "동의서", "계약서", "기타"];

  return (
    <div style={{ maxWidth: "800px" }}>
      <h1 style={{ fontSize: "22px", fontWeight: 700, marginBottom: "6px", color: "#111827" }}>📁 서류 보관함</h1>
      <p style={{ color: "#6b7280", fontSize: "14px", marginBottom: "24px" }}>고객별 서류 현황을 관리하세요</p>

      <div style={{ background: "#fff", borderRadius: "12px", padding: "20px", boxShadow: "0 1px 4px rgba(0,0,0,0.06)", marginBottom: "20px" }}>
        <h3 style={{ fontSize: "14px", fontWeight: 600, marginBottom: "14px" }}>서류 등록</h3>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 2fr auto", gap: "10px", alignItems: "end" }}>
          <input placeholder="고객명 *" value={form.customer} onChange={e => setForm({ ...form, customer: e.target.value })} style={{ padding: "9px 12px", border: "1px solid #e5e7eb", borderRadius: "8px", fontSize: "14px" }} />
          <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} style={{ padding: "9px 12px", border: "1px solid #e5e7eb", borderRadius: "8px", fontSize: "14px" }}>
            {DOC_TYPES.map(t => <option key={t}>{t}</option>)}
          </select>
          <input placeholder="메모" value={form.memo} onChange={e => setForm({ ...form, memo: e.target.value })} style={{ padding: "9px 12px", border: "1px solid #e5e7eb", borderRadius: "8px", fontSize: "14px" }} />
          <button onClick={addDoc} disabled={adding} style={{ padding: "9px 18px", background: "#111827", color: "#fff", border: "none", borderRadius: "8px", cursor: "pointer", fontSize: "14px", whiteSpace: "nowrap" }}>+ 등록</button>
        </div>
      </div>

      <div style={{ background: "#fff", borderRadius: "12px", boxShadow: "0 1px 4px rgba(0,0,0,0.06)", overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#f9fafb" }}>
              {["고객명", "서류 종류", "메모", "등록일", ""].map(h => (
                <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontSize: "12px", color: "#6b7280", fontWeight: 500 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {docs.length === 0 ? (
              <tr><td colSpan={5} style={{ padding: "40px", textAlign: "center", color: "#9ca3af", fontSize: "14px" }}>등록된 서류가 없어요</td></tr>
            ) : docs.map(d => (
              <tr key={d.id} style={{ borderTop: "1px solid #f3f4f6" }}>
                <td style={{ padding: "12px 16px", fontSize: "14px", fontWeight: 500 }}>{d.customer}</td>
                <td style={{ padding: "12px 16px" }}><span style={{ background: "#eff6ff", color: "#3b82f6", padding: "2px 8px", borderRadius: "4px", fontSize: "12px" }}>{d.type}</span></td>
                <td style={{ padding: "12px 16px", fontSize: "13px", color: "#6b7280" }}>{d.memo}</td>
                <td style={{ padding: "12px 16px", fontSize: "12px", color: "#9ca3af" }}>{new Date(d.created_at).toLocaleDateString("ko-KR")}</td>
                <td style={{ padding: "12px 16px" }}><button onClick={() => deleteDoc(d.id)} style={{ background: "none", border: "1px solid #e5e7eb", borderRadius: "4px", padding: "3px 8px", cursor: "pointer", color: "#9ca3af", fontSize: "12px" }}>삭제</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
