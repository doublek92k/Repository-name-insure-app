"use client";
import { useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://tlffsjvkyccwxdpdmcxs.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRsZmZzanZreWNjd3hkcGRtY3hzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAwNzM1NDYsImV4cCI6MjA5NTY0OTU0Nn0.l839UdiUMyLrJBsf5OAH7FHLqLJRMOJYeOjJog0Sq9I"
);

export default function Consulting() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
  const [loading, setLoading] = useState(false);

  async function send() {
    if (!input.trim()) return;
    const userMsg = { role: "user", content: input };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    const res = await fetch("/api/consult", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: newMessages }),
    });
    const data = await res.json();
    setMessages([...newMessages, { role: "assistant", content: data.reply }]);
    setLoading(false);
  }

  return (
    <div style={{ maxWidth: "720px" }}>
      <h1 style={{ fontSize: "22px", fontWeight: 700, marginBottom: "6px", color: "#111827" }}>🤖 상담 AI</h1>
      <p style={{ color: "#6b7280", fontSize: "14px", marginBottom: "24px" }}>보험 상담 시나리오, 고객 응대 멘트, 반론 처리 등을 도와드려요</p>

      <div style={{ background: "#fff", borderRadius: "12px", boxShadow: "0 1px 4px rgba(0,0,0,0.06)", minHeight: "420px", display: "flex", flexDirection: "column" }}>
        <div style={{ flex: 1, padding: "20px", overflowY: "auto", maxHeight: "420px", display: "flex", flexDirection: "column", gap: "12px" }}>
          {messages.length === 0 && (
            <div style={{ color: "#9ca3af", fontSize: "14px", textAlign: "center", marginTop: "80px" }}>
              💡 질문 예시: "40대 자영업자에게 종신보험 추천 멘트 만들어줘"
            </div>
          )}
          {messages.map((m, i) => (
            <div key={i} style={{ display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start" }}>
              <div style={{
                maxWidth: "80%", padding: "12px 16px", borderRadius: "12px", fontSize: "14px", lineHeight: "1.6",
                background: m.role === "user" ? "#111827" : "#f3f4f6",
                color: m.role === "user" ? "#fff" : "#111827",
              }}>{m.content}</div>
            </div>
          ))}
          {loading && (
            <div style={{ display: "flex", justifyContent: "flex-start" }}>
              <div style={{ background: "#f3f4f6", padding: "12px 16px", borderRadius: "12px", fontSize: "14px", color: "#6b7280" }}>생각 중...</div>
            </div>
          )}
        </div>

        <div style={{ padding: "16px", borderTop: "1px solid #f3f4f6", display: "flex", gap: "8px" }}>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && send()}
            placeholder="상담 관련 질문을 입력하세요..."
            style={{ flex: 1, padding: "10px 14px", border: "1px solid #e5e7eb", borderRadius: "8px", fontSize: "14px", outline: "none" }}
          />
          <button
            onClick={send}
            disabled={loading}
            style={{ padding: "10px 20px", background: "#111827", color: "#fff", border: "none", borderRadius: "8px", cursor: "pointer", fontSize: "14px" }}
          >전송</button>
        </div>
      </div>
    </div>
  );
}
