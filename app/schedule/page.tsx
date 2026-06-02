"use client";
import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://tlffsjvkyccwxdpdmcxs.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRsZmZzanZreWNjd3hkcGRtY3hzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAwNzM1NDYsImV4cCI6MjA5NTY0OTU0Nn0.l839UdiUMyLrJBsf5OAH7FHLqLJRMOJYeOjJog0Sq9I"
);

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
  const upcoming = items.filter(i => !i.done && i.date >= today);
  const past = items.filter(i => i.done || i.date < today);

  return (
    <div style={{ maxWidth: "800px" }}>
      <h1 style={{ fontSize: "22px", fontWeight: 700, marginBottom: "6px", color: "#111827" }}>📅 일정 & 팔로업</h1>
      <p style={{ color: "#6b7280", fontSize: "14px", marginBottom: "24px" }}>고객 팔로업 일정을 관리하세요</p>

      <div style={{ background: "#fff", borderRadius: "12px", padding: "20px", boxShadow: "0 1px 4px rgba(0,0,0,0.06)", marginBottom: "20px" }}>
        <h3 style={{ fontSize: "14px", fontWeight: 600, marginBottom: "14px" }}>일정 추가</h3>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 2fr auto", gap: "10px", alignItems: "end" }}>
          <input placeholder="고객명 *" value={form.customer} onChange={e => setForm({ ...form, customer: e.target.value })} style={{ padding: "9px 12px", border: "1px solid #e5e7eb", borderRadius: "8px", fontSize: "14px" }} />
          <input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} style={{ padding: "9px 12px", border: "1px solid #e5e7eb", borderRadius: "8px", fontSize: "14px" }} />
          <input placeholder="메모" value={form.note} onChange={e => setForm({ ...form, note: e.target.value })} style={{ padding: "9px 12px", border: "1px solid #e5e7eb", borderRadius: "8px", fontSize: "14px" }} />
          <button onClick={addItem} disabled={adding} style={{ padding: "9px 18px", background: "#111827", color: "#fff", border: "none", borderRadius: "8px", cursor: "pointer", fontSize: "14px", whiteSpace: "nowrap" }}>+ 추가</button>
        </div>
      </div>

      <div style={{ background: "#fff", borderRadius: "12px", boxShadow: "0 1px 4px rgba(0,0,0,0.06)", overflow: "hidden", marginBottom: "16px" }}>
        <div style={{ padding: "16px 20px", borderBottom: "1px solid #f3f4f6", fontWeight: 600, fontSize: "14px", color: "#111827" }}>🔔 예정 일정 ({upcoming.length})</div>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <tbody>
            {upcoming.length === 0 ? (
              <tr><td colSpan={4} style={{ padding: "30px", textAlign: "center", color: "#9ca3af", fontSize: "14px" }}>예정된 일정이 없어요</td></tr>
            ) : upcoming.map(item => (
              <tr key={item.id} style={{ borderTop: "1px solid #f3f4f6" }}>
                <td style={{ padding: "12px 16px", fontSize: "14px", fontWeight: 500 }}>{item.customer}</td>
                <td style={{ padding: "12px 16px" }}><span style={{ background: item.date === today ? "#fef3c7" : "#f0fdf4", color: item.date === today ? "#d97706" : "#16a34a", padding: "2px 8px", borderRadius: "4px", fontSize: "12px" }}>{item.date === today ? "오늘" : item.date}</span></td>
                <td style={{ padding: "12px 16px", fontSize: "13px", color: "#6b7280", flex: 1 }}>{item.note}</td>
                <td style={{ padding: "12px 16px", display: "flex", gap: "6px" }}>
                  <button onClick={() => toggleDone(item.id, item.done)} style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: "4px", padding: "3px 10px", cursor: "pointer", color: "#16a34a", fontSize: "12px" }}>완료</button>
                  <button onClick={() => deleteItem(item.id)} style={{ background: "none", border: "1px solid #e5e7eb", borderRadius: "4px", padding: "3px 8px", cursor: "pointer", color: "#9ca3af", fontSize: "12px" }}>삭제</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{ background: "#fff", borderRadius: "12px", boxShadow: "0 1px 4px rgba(0,0,0,0.06)", overflow: "hidden" }}>
        <div style={{ padding: "16px 20px", borderBottom: "1px solid #f3f4f6", fontWeight: 600, fontSize: "14px", color: "#6b7280" }}>✅ 완료 / 지난 일정 ({past.length})</div>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <tbody>
            {past.length === 0 ? (
              <tr><td colSpan={4} style={{ padding: "30px", textAlign: "center", color: "#9ca3af", fontSize: "14px" }}>없어요</td></tr>
            ) : past.map(item => (
              <tr key={item.id} style={{ borderTop: "1px solid #f3f4f6", opacity: 0.6 }}>
                <td style={{ padding: "12px 16px", fontSize: "14px", textDecoration: "line-through" }}>{item.customer}</td>
                <td style={{ padding: "12px 16px", fontSize: "12px", color: "#9ca3af" }}>{item.date}</td>
                <td style={{ padding: "12px 16px", fontSize: "13px", color: "#9ca3af" }}>{item.note}</td>
                <td style={{ padding: "12px 16px" }}><button onClick={() => deleteItem(item.id)} style={{ background: "none", border: "1px solid #e5e7eb", borderRadius: "4px", padding: "3px 8px", cursor: "pointer", color: "#9ca3af", fontSize: "12px" }}>삭제</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
