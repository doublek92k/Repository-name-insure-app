"use client";
import { useEffect, useRef, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://tlffsjvkyccwxdpdmcxs.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRsZmZzanZreWNjd3hkcGRtY3hzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ0MjcxNzUsImV4cCI6MjA1MDAwMzE3NX0.I839UdiUMyLrJBsf50AH7FHLqLJPMOJYeOjJogOSq9I"
);

const DOC_TYPES = ["청약서", "설계서", "동의서", "계약서", "기타"];
const BUCKET = "documents";

export default function Documents() {
  const [docs, setDocs] = useState<any[]>([]);
  const [form, setForm] = useState({ customer: "", type: "청약서", memo: "" });
  const [adding, setAdding] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => { fetchDocs(); }, []);

  async function fetchDocs() {
    const { data } = await supabase.from("documents").select("*").order("created_at", { ascending: false });
    if (data) setDocs(data);
  }

  async function addDoc() {
    if (!form.customer) return alert("고객명을 입력하세요");
    setAdding(true);
    let fileUrl = "";
    let fileName = "";
    if (file) {
      setUploading(true);
      const ext = file.name.split(".").pop();
      const path = `${Date.now()}_${form.customer}.${ext}`;
      const { error } = await supabase.storage.from(BUCKET).upload(path, file);
      if (!error) {
        const { data: urlData } = supabase.storage.from(BUCKET).getPublicUrl(path);
        fileUrl = urlData.publicUrl;
        fileName = file.name;
      }
      setUploading(false);
    }
    await supabase.from("documents").insert([{
      customer: form.customer, type: form.type, memo: form.memo,
      file_url: fileUrl || null, file_name: fileName || null
    }]);
    setForm({ customer: "", type: "청약서", memo: "" });
    setFile(null);
    if (fileRef.current) fileRef.current.value = "";
    await fetchDocs();
    setAdding(false);
  }

  async function deleteDoc(id: number, fileUrl?: string) {
    if (!confirm("삭제할까요?")) return;
    if (fileUrl) {
      const path = fileUrl.split(`/${BUCKET}/`)[1];
      if (path) await supabase.storage.from(BUCKET).remove([path]);
    }
    await supabase.from("documents").delete().eq("id", id);
    fetchDocs();
  }

  const TYPE_COLOR: Record<string, string> = {
    "청약서": "#ede9fe", "설계서": "#dbeafe", "동의서": "#d1fae5",
    "계약서": "#fef3c7", "기타": "#f1f5f9"
  };
  const TYPE_TEXT: Record<string, string> = {
    "청약서": "#7c3aed", "설계서": "#2563eb", "동의서": "#059669",
    "계약서": "#d97706", "기타": "#64748b"
  };

  return (
    <div style={{ maxWidth: "800px" }}>
      <h1 style={{ fontSize: "22px", fontWeight: 800, marginBottom: "6px", color: "#1e293b" }}>📁 서류 보관함</h1>
      <p style={{ color: "#64748b", fontSize: "14px", marginBottom: "24px" }}>고객별 서류를 등록하고 파일을 첨부하세요</p>

      <div style={{ background: "#fff", borderRadius: "14px", padding: "20px", boxShadow: "0 1px 6px rgba(0,0,0,0.06)", border: "1px solid #f1f5f9", marginBottom: "24px" }}>
        <div style={{ fontWeight: 700, fontSize: "14px", color: "#1e293b", marginBottom: "14px" }}>새 서류 등록</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "10px", marginBottom: "10px" }}>
          <input placeholder="고객명 *" value={form.customer} onChange={(e) => setForm((f) => ({ ...f, customer: e.target.value }))}
            style={{ border: "1px solid #e2e8f0", borderRadius: "8px", padding: "9px 12px", fontSize: "14px" }} />
          <select value={form.type} onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))}
            style={{ border: "1px solid #e2e8f0", borderRadius: "8px", padding: "9px 12px", fontSize: "14px" }}>
            {DOC_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
          <input placeholder="메모 (선택)" value={form.memo} onChange={(e) => setForm((f) => ({ ...f, memo: e.target.value }))}
            style={{ border: "1px solid #e2e8f0", borderRadius: "8px", padding: "9px 12px", fontSize: "14px" }} />
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap", marginBottom: "12px" }}>
          <label style={{ display: "flex", alignItems: "center", gap: "8px", background: "#f8fafc", border: "1px dashed #cbd5e1", borderRadius: "8px", padding: "8px 14px", cursor: "pointer", fontSize: "13px", color: "#64748b" }}>
            📎 파일 첨부 {file && <span style={{ color: "#4f46e5", fontWeight: 600 }}>{file.name}</span>}
            <input ref={fileRef} type="file" style={{ display: "none" }} onChange={(e) => setFile(e.target.files?.[0] || null)} />
          </label>
          {file && <button onClick={() => { setFile(null); if (fileRef.current) fileRef.current.value = ""; }} style={{ background: "none", border: "none", color: "#94a3b8", cursor: "pointer", fontSize: "18px" }}>×</button>}
        </div>
        <button onClick={addDoc} disabled={adding}
          style={{ background: "#4f46e5", color: "#fff", border: "none", borderRadius: "8px", padding: "10px 20px", fontSize: "14px", fontWeight: 700, cursor: "pointer" }}>
          {uploading ? "업로드 중..." : adding ? "저장 중..." : "+ 서류 등록"}
        </button>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        {docs.length === 0 && <div style={{ color: "#94a3b8", fontSize: "14px", textAlign: "center", padding: "40px" }}>등록된 서류가 없어요</div>}
        {docs.map((doc) => (
          <div key={doc.id} style={{ background: "#fff", borderRadius: "12px", padding: "16px 20px", boxShadow: "0 1px 4px rgba(0,0,0,0.05)", border: "1px solid #f1f5f9", display: "flex", alignItems: "center", gap: "14px", flexWrap: "wrap" }}>
            <span style={{ background: TYPE_COLOR[doc.type] || "#f1f5f9", color: TYPE_TEXT[doc.type] || "#64748b", borderRadius: "20px", padding: "3px 10px", fontSize: "12px", fontWeight: 700, flexShrink: 0 }}>{doc.type}</span>
            <div style={{ flex: 1, minWidth: "120px" }}>
              <div style={{ fontWeight: 700, fontSize: "14px", color: "#1e293b" }}>{doc.customer}</div>
              {doc.memo && <div style={{ fontSize: "12px", color: "#94a3b8", marginTop: "2px" }}>{doc.memo}</div>}
            </div>
            {doc.file_url && (
              <a href={doc.file_url} target="_blank" rel="noopener noreferrer"
                style={{ background: "#f0fdf4", color: "#059669", border: "1px solid #bbf7d0", borderRadius: "8px", padding: "5px 12px", fontSize: "12px", fontWeight: 600, textDecoration: "none", flexShrink: 0 }}>
                ⬇ {doc.file_name || "파일"}
              </a>
            )}
            <div style={{ fontSize: "11px", color: "#cbd5e1", flexShrink: 0 }}>{new Date(doc.created_at).toLocaleDateString("ko-KR")}</div>
            <button onClick={() => deleteDoc(doc.id, doc.file_url)} style={{ background: "none", border: "none", color: "#cbd5e1", cursor: "pointer", fontSize: "18px", flexShrink: 0 }}>×</button>
          </div>
        ))}
      </div>
    </div>
  );
}
