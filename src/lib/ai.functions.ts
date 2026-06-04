import { createServerFn } from "@tanstack/react-start";
import { generateText } from "ai";
import { z } from "zod";
import { createLovableAiGatewayProvider } from "./ai-gateway.server";

const MODEL = "google/gemini-3-flash-preview";

function getModel() {
  const key = process.env.LOVABLE_API_KEY;
  if (!key) throw new Error("Missing LOVABLE_API_KEY");
  return createLovableAiGatewayProvider(key)(MODEL);
}

/* Email Generator */
const EmailInput = z.object({
  context: z.string().min(1).max(4000),
  tone: z.enum(["formal", "informal", "persuasive"]),
  audience: z.enum(["client", "manager", "team"]),
});

export const generateEmail = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => EmailInput.parse(d))
  .handler(async ({ data }) => {
    const { text } = await generateText({
      model: getModel(),
      system:
        "You are an expert workplace communication writer. Produce a single, polished professional email. " +
        "Return only the email itself (Subject line on first line, then a blank line, then the body). " +
        "No preamble, no explanations, no markdown fences.",
      prompt:
        `Tone: ${data.tone}\nAudience: ${data.audience}\n\nContext / what to convey:\n${data.context}`,
    });
    return { email: text.trim() };
  });

/* Meeting Notes Summarizer */
const NotesInput = z.object({ notes: z.string().min(1).max(20000) });

export const summarizeNotes = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => NotesInput.parse(d))
  .handler(async ({ data }) => {
    const { text } = await generateText({
      model: getModel(),
      system:
        "You are an expert executive assistant. Summarize meeting notes into clean Markdown with these sections: " +
        "## Summary (2-3 sentences), ## Key Points (bullets), ## Decisions (bullets), " +
        "## Action Items (table with columns: Task | Owner | Deadline), ## Risks / Open Questions. " +
        "If information is missing, write 'Not specified'. Be concise and concrete.",
      prompt: data.notes,
    });
    return { summary: text.trim() };
  });

/* Task Planner */
const PlannerInput = z.object({
  goals: z.string().min(1).max(4000),
  horizon: z.enum(["day", "week"]),
});

export const generatePlan = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => PlannerInput.parse(d))
  .handler(async ({ data }) => {
    const { text } = await generateText({
      model: getModel(),
      system:
        "You are a productivity coach. Build a structured, prioritized " +
        (data.horizon === "day" ? "daily" : "weekly") +
        " plan in clean Markdown. Use the Eisenhower matrix to prioritize. " +
        "Include sections: ## Priorities (ranked), ## Schedule (time-blocked), " +
        "## Focus Tips (2-3 time-optimization strategies). Be specific and actionable.",
      prompt: `Goals & tasks:\n${data.goals}`,
    });
    return { plan: text.trim() };
  });

/* Research Assistant */
const ResearchInput = z.object({ topic: z.string().min(1).max(8000) });

export const researchTopic = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => ResearchInput.parse(d))
  .handler(async ({ data }) => {
    const { text } = await generateText({
      model: getModel(),
      system:
        "You are a senior research analyst. Given an article, report, or topic, produce clean Markdown with: " +
        "## TL;DR (2-3 sentences), ## Key Insights (bullets), ## Simple Explanation (plain-language), " +
        "## Recommendations (bullets), ## Caveats. Be precise; do not invent statistics.",
      prompt: data.topic,
    });
    return { brief: text.trim() };
  });
