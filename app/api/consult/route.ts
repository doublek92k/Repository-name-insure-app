import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { messages } = await req.json();

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.ANTHROPIC_API_KEY || "",
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-opus-4-5",
      max_tokens: 1024,
      system: "당신은 보험 영업 전문가 AI 어시스턴트입니다. 보험 영업사원이 고객 상담, 상품 설명, 반론 처리, 멘트 작성 등을 잘 할 수 있도록 실용적이고 구체적인 조언을 한국어로 제공하세요.",
      messages,
    }),
  });

  const data = await res.json();
  const reply = data.content?.[0]?.text || "응답을 받지 못했어요.";
  return NextResponse.json({ reply });
}
