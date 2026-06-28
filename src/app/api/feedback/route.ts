import { NextResponse } from "next/server";
import { z } from "zod";

const feedbackSchema = z.object({
  type: z.enum(["idea", "bug", "comment"]),
  message: z.string().trim().min(3).max(2000),
  email: z.union([z.string().trim().email().max(254), z.literal("")]),
  page: z.string().url().max(2048),
  website: z.string().max(0),
});

const labels = {
  idea: "Idea",
  bug: "Bug",
  comment: "Comment",
} as const;

function escapeHtml(value: string) {
  return value.replace(
    /[&<>'"]/g,
    (character) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        "'": "&#39;",
        '"': "&quot;",
      })[character]!,
  );
}

export async function POST(request: Request) {
  const parsed = feedbackSchema.safeParse(await request.json().catch(() => null));

  if (!parsed.success) {
    return NextResponse.json({ error: "Please check the form and try again." }, { status: 400 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const recipient = process.env.FEEDBACK_TO_EMAIL;
  const from = process.env.FEEDBACK_FROM_EMAIL || "Memory Palace <onboarding@resend.dev>";

  if (!apiKey || !recipient) {
    console.error("Feedback email is not configured. Set RESEND_API_KEY and FEEDBACK_TO_EMAIL.");
    return NextResponse.json({ error: "Feedback email is temporarily unavailable." }, { status: 503 });
  }

  const { type, message, email, page } = parsed.data;
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [recipient],
      reply_to: email || undefined,
      subject: `[Memory Palace feedback] ${labels[type]}`,
      html: `
        <h2>${labels[type]} from Memory Palace</h2>
        <p style="white-space:pre-wrap">${escapeHtml(message)}</p>
        <hr>
        <p><strong>Reply to:</strong> ${email ? escapeHtml(email) : "Not provided"}</p>
        <p><strong>Page:</strong> ${escapeHtml(page)}</p>
      `,
    }),
  });

  if (!response.ok) {
    console.error("Resend rejected feedback email:", response.status, await response.text());
    return NextResponse.json({ error: "We couldn't send your feedback right now." }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
