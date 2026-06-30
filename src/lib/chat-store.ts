export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: number;
}

export interface ChatThread {
  id: string;
  title: string;
  updatedAt: number;
  messages: ChatMessage[];
}

const KEY = "workspace-ai-threads";

export function loadThreads(): ChatThread[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return [];
    return JSON.parse(raw) as ChatThread[];
  } catch {
    return [];
  }
}

export function saveThreads(threads: ChatThread[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY, JSON.stringify(threads));
}

export function createThread(): ChatThread {
  return {
    id: `t_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`,
    title: "New conversation",
    updatedAt: Date.now(),
    messages: [],
  };
}

export function mockReply(prompt: string): string {
  const lower = prompt.toLowerCase();
  if (lower.includes("email")) {
    return "Happy to help draft that email! I'd suggest a friendly opener, a clear ask in the second paragraph, and a single specific call-to-action at the end. Want me to draft the full version?";
  }
  if (lower.includes("meeting") || lower.includes("agenda")) {
    return "For a productive meeting, I recommend a 3-part agenda: 5 min context, 20 min discussion on the top decision, 5 min next steps. Should I generate a full agenda for your topic?";
  }
  if (lower.includes("plan") || lower.includes("schedule") || lower.includes("task")) {
    return "Great — let's structure that. Could you tell me: 1) your top 3 priorities today, 2) any hard deadlines, and 3) your available focus hours? I'll build an optimized plan.";
  }
  if (lower.includes("research") || lower.includes("learn")) {
    return "I'd start by framing the question into 3 sub-questions, then pull the latest sources, then summarize the trade-offs. Want me to run a structured research pass on this?";
  }
  return `Got it — here are a few angles on that:\n\n• A quick win: focus on the one decision that unblocks the most downstream work.\n• A longer play: identify the underlying pattern, not just the symptom.\n• A risk check: what's the cost of doing nothing for one more week?\n\nWant me to go deeper on any of these?`;
}