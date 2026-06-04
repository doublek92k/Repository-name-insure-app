"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function Schedule() {
  const [items, setItems] = useState<any[]>([]);
  const [form, setForm] = useState({ customer: "", date: "", note: "", done: false });
  const [adding, setAdding] = useState(false);

  useEffect(() => { fetchItems(); }, []);

  async function fetchItems() {
    const { data } = await supabase.from("schedule").select("*").order("date", { ascending: true });
    if (data) setItems(data);
  }

  async function addItem() {
    if (!form.customer || !form.date) return alert("고객명과 날짜를 입력하세요");
    setAdding(true);
    await supabase.from("schedule").insert([{ customer: form.customer, date: form.date, note: form.note, done: false }]);
    setForm({ customer: "", date: "", note: "", done: false });
    await fetchItems();
    setAdding(false);
  }

  async function toggleDone(id: number, done: boolean) {
    await supabase.from("schedule").update({ done: !done }).eq("id", id);
    fetchItems();
  }

  async function deleteItem(id: number) {
    if (!confirm("삭제할까요?")) return;
    await supabase.from("schedule").delete().eq("id", id);
    fetchItems();
  }

  const today = new Date().toISOString().split("T")[0];
  const pending = items.filter((i) => !i.done);
  const done = items.filter((i) => i.done);

  return (
    <div style={{ maxWidth: "700px" }}>
      <h1 style={{ fontSize: "22px", fontWeight: 800, marginBottom: "6px", color: "#1e293b" }}>📋 일정 & 팔로업</h1>
      <p style={{ color: "#64748b", fontSize: "14px", marginBottom: "24px" }}>팔로업 일정을 관리하세요</p>

      <div style={{ background: "#fff", borderRadius: "14px", padding: "20px", boxShadow: "0 1px 6px rgba(0,0,0,0.06)", border: "1px solid #f1f5f9", marginBottom: "24px" }}>
        <div style={{ fontWeight: 700, fontSize: "14px", color: "#1e293b", marginBottom: "14px" }}>새 일정 추가</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "10px", marginBottom: "10px" }}>
          <input placeholder="고객명 *" value={form.customer} onChange={(e) => setForm((f) => ({ ...f, customer: e.target.value }))} style={{ border: "1px solid #e2e8f0", borderRadius: "8px", padding: "9px 12px", fontSize: "14px" }} />
          <input type="date" value={form.date} onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))} style={{ border: "1px solid #e2e8f0", borderRadius: "8px", padding: "9px 12px", fontSize: "14px" }} />
          <input placeholder="메모 (선택)" value={form.note} onChange={(e) => setForm((f) => ({ ...f, note: e.target.value }))} style={{ border: "1px solid #e2e8f0", borderRadius: "8px", padding: "9px 12px", fontSize: "14px" }} />
        </div>
        <button onClick={addItem} disabled={adding} style={{ background: "#4f46e5", color: "#fff", border: "none", borderRadius: "8px", padding: "10px 20px", fontSize: "14px", fontWeight: 700, cursor: "pointer" }}>
          {adding ? "저장 중..." : "+ 일정 추가"}
        </button>
      </div>

      <div style={{ marginBottom: "24px" }}>
        <div style={{ fontWeight: 700, fontSize: "15px", color: "#1e293b", marginBottom: "12px" }}>
          📌 미완료 <span style={{ fontSize: "13px", color: "#94a3b8", fontWeight: 400 }}>({pending.length}건)</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {pending.length === 0 && <div style={{ color: "#94a3b8", fontSize: "13px", padding: "16px" }}>완료할 일정이 없어요 🎉</div>}
          {pending.map((item) => (
            <div key={item.id} style={{ background: "#fff", borderRadius: "12px", padding: "14px 16px", display: "flex", alignItems: "center", gap: "12px", boxShadow: "0 1px 4px rgba(0,0,0,0.05)", border: item.date === today ? "1px solid #4f46e5" : "1px solid #f1f5f9", flexWrap: "wrap" }}>
              <input type="checkbox" checked={item.done} onChange={() => toggleDone(item.id, item.done)} style={{ width: "18px", height: "18px", cursor: "pointer", flexShrink: 0 }} />
              <div style={{ flex: 1, minWidth: "120px" }}>
                <div style={{ fontWeight: 700, fontSize: "14px", color: "#1e293b" }}>{item.customer}</div>
                {item.note && <div style={{ fontSize: "12px", color: "#94a3b8", marginTop: "2px" }}>{item.note}</div>}
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", flexShrink: 0 }}>
                <span style={{ fontSize: "12px", fontWeight: 600, color: item.date === today ? "#4f46e5" : "#64748b", background: item.date === today ? "#ede9fe" : "#f8fafc", borderRadius: "6px", padding: "3px 8px" }}>
                  {item.date === today ? "📍 오늘" : item.date}
                </span>
                <button onClick={() => deleteItem(item.id)} style={{ background: "none", border: "none", color: "#cbd5e1", cursor: "pointer", fontSize: "18px" }}>×</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {done.length > 0 && (
        <div>
          <div style={{ fontWeight: 700, fontSize: "15px", color: "#94a3b8", marginBottom: "12px" }}>
            ✅ 완료 <span style={{ fontSize: "13px", fontWeight: 400 }}>({done.length}건)</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {done.map((item) => (
              <div key={item.id} style={{ background: "#f8fafc", borderRadius: "12px", padding: "14px 16px", display: "flex", alignItems: "center", gap: "12px", border: "1px solid #f1f5f9", opacity: 0.7, flexWrap: "wrap" }}>
                <input type="checkbox" checked={item.done} onChange={() => toggleDone(item.id, item.done)} style={{ width: "18px", height: "18px", cursor: "pointer", flexShrink: 0 }} />
                <div style={{ flex: 1, minWidth: "120px" }}>
                  <div style={{ fontWeight: 600, fontSize: "14px", color: "#94a3b8", textDecoration: "line-through" }}>{item.customer}</div>
                  {item.note && <div style={{ fontSize: "12px", color: "#cbd5e1", marginTop: "2px" }}>{item.note}</div>}
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", flexShrink: 0 }}>
                  <span style={{ fontSize: "12px", color: "#cbd5e1" }}>{item.date}</span>
                  <button onClick={() => deleteItem(item.id)} style={{ background: "none", border: "none", color: "#e2e8f0", cursor: "pointer", fontSize: "18px" }}>×</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
