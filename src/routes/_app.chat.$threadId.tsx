import { createFileRoute, useParams } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Send, RefreshCw, Trash2, Sparkles, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  type ChatMessage,
  type ChatThread,
  loadThreads,
  mockReply,
  saveThreads,
} from "@/lib/chat-store";

export const Route = createFileRoute("/_app/chat/$threadId")({
  component: ChatThreadView,
});

const suggestions = [
  "Draft a follow-up email to a client",
  "Help me prep for tomorrow's meeting",
  "Brainstorm Q4 product ideas",
  "Summarize the pros and cons of remote work",
];

function notifyChange() {
  window.dispatchEvent(new Event("workspace-threads-changed"));
}

function ChatThreadView() {
  const { threadId } = useParams({ from: "/_app/chat/$threadId" });
  const [thread, setThread] = useState<ChatThread | null>(null);
  const [input, setInput] = useState("");
  const [pending, setPending] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const all = loadThreads();
    const found = all.find((t) => t.id === threadId);
    setThread(found ?? null);
    setInput("");
    inputRef.current?.focus();
  }, [threadId]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [thread?.messages.length, pending]);

  if (!thread) {
    return (
      <div className="grid place-items-center rounded-2xl border border-border bg-card p-8 text-center text-sm text-muted-foreground">
        Loading conversation...
      </div>
    );
  }

  const persist = (updated: ChatThread) => {
    const all = loadThreads();
    const next = all.map((t) => (t.id === updated.id ? updated : t));
    if (!all.some((t) => t.id === updated.id)) next.unshift(updated);
    // move active to top
    const sorted = [updated, ...next.filter((t) => t.id !== updated.id)];
    saveThreads(sorted);
    setThread(updated);
    notifyChange();
  };

  const send = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || pending) return;
    const now = Date.now();
    const userMsg: ChatMessage = {
      id: `m_${now}`,
      role: "user",
      content: trimmed,
      timestamp: now,
    };
    const updatedWithUser: ChatThread = {
      ...thread,
      title: thread.messages.length === 0 ? trimmed.slice(0, 40) : thread.title,
      messages: [...thread.messages, userMsg],
      updatedAt: now,
    };
    persist(updatedWithUser);
    setInput("");
    setPending(true);

    setTimeout(() => {
      const replyMsg: ChatMessage = {
        id: `m_${Date.now()}`,
        role: "assistant",
        content: mockReply(trimmed),
        timestamp: Date.now(),
      };
      const final: ChatThread = {
        ...updatedWithUser,
        messages: [...updatedWithUser.messages, replyMsg],
        updatedAt: Date.now(),
      };
      persist(final);
      setPending(false);
      inputRef.current?.focus();
    }, 1000);
  };

  const regenerate = () => {
    if (!thread.messages.length) return;
    const lastUserIdx = [...thread.messages].reverse().findIndex((m) => m.role === "user");
    if (lastUserIdx < 0) return;
    const idx = thread.messages.length - 1 - lastUserIdx;
    const trimmed: ChatThread = {
      ...thread,
      messages: thread.messages.slice(0, idx + 1),
    };
    persist(trimmed);
    setPending(true);
    setTimeout(() => {
      const userText = thread.messages[idx].content;
      const reply: ChatMessage = {
        id: `m_${Date.now()}`,
        role: "assistant",
        content: mockReply(userText),
        timestamp: Date.now(),
      };
      persist({ ...trimmed, messages: [...trimmed.messages, reply], updatedAt: Date.now() });
      setPending(false);
    }, 900);
  };

  const clearConversation = () => {
    persist({ ...thread, title: "New conversation", messages: [], updatedAt: Date.now() });
  };

  const formatTime = (ts: number) =>
    new Date(ts).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  return (
    <div className="flex flex-col overflow-hidden rounded-2xl border border-border bg-card">
      {/* Chat header */}
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <div className="flex min-w-0 items-center gap-2.5">
          <div
            className="grid h-8 w-8 shrink-0 place-items-center rounded-lg text-white"
            style={{ background: "var(--gradient-primary)" }}
          >
            <Sparkles className="h-4 w-4" />
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold">{thread.title}</p>
            <p className="text-xs text-muted-foreground">Workspace AI · Always-on assistant</p>
          </div>
        </div>
        <Button size="sm" variant="ghost" onClick={clearConversation}>
          <Trash2 className="h-3.5 w-3.5" />
          <span className="ml-1.5 hidden sm:inline">Clear</span>
        </Button>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-6">
        {thread.messages.length === 0 ? (
          <div className="mx-auto flex h-full max-w-md flex-col items-center justify-center text-center">
            <div
              className="grid h-16 w-16 place-items-center rounded-2xl text-white shadow-[var(--shadow-elegant)]"
              style={{ background: "var(--gradient-primary)" }}
            >
              <MessageSquare className="h-7 w-7" />
            </div>
            <h2 className="mt-4 text-xl font-bold">How can I help you today?</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Ask anything about your work — emails, planning, research, brainstorming.
            </p>
            <div className="mt-6 grid w-full gap-2">
              {suggestions.map((s) => (
                <button
                  key={s}
                  onClick={() => send(s)}
                  className="rounded-xl border border-border bg-background px-4 py-3 text-left text-sm transition hover:border-primary/50 hover:bg-accent/40"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="mx-auto max-w-3xl space-y-5">
            {thread.messages.map((m) => (
              <div key={m.id} className={`flex gap-3 ${m.role === "user" ? "justify-end" : ""}`}>
                {m.role === "assistant" && (
                  <div
                    className="grid h-8 w-8 shrink-0 place-items-center rounded-lg text-white"
                    style={{ background: "var(--gradient-primary)" }}
                  >
                    <Sparkles className="h-3.5 w-3.5" />
                  </div>
                )}
                <div className={`flex max-w-[80%] flex-col ${m.role === "user" ? "items-end" : ""}`}>
                  <div
                    className={`rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                      m.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "text-foreground"
                    }`}
                    style={m.role === "assistant" ? { whiteSpace: "pre-wrap" } : { whiteSpace: "pre-wrap" }}
                  >
                    {m.content}
                  </div>
                  <p className="mt-1 px-1 text-[10px] text-muted-foreground">{formatTime(m.timestamp)}</p>
                </div>
              </div>
            ))}
            {pending && (
              <div className="flex gap-3">
                <div
                  className="grid h-8 w-8 shrink-0 place-items-center rounded-lg text-white"
                  style={{ background: "var(--gradient-primary)" }}
                >
                  <Sparkles className="h-3.5 w-3.5" />
                </div>
                <div className="flex items-center gap-1 rounded-2xl px-4 py-3">
                  <span className="h-2 w-2 animate-bounce rounded-full bg-primary [animation-delay:-0.3s]" />
                  <span className="h-2 w-2 animate-bounce rounded-full bg-primary [animation-delay:-0.15s]" />
                  <span className="h-2 w-2 animate-bounce rounded-full bg-primary" />
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Composer */}
      <div className="border-t border-border bg-background/50 p-3">
        <div className="mx-auto max-w-3xl">
          {thread.messages.length > 0 && !pending && (
            <div className="mb-2 flex justify-center">
              <Button size="sm" variant="ghost" onClick={regenerate} className="text-xs">
                <RefreshCw className="h-3 w-3" />
                <span className="ml-1">Regenerate response</span>
              </Button>
            </div>
          )}
          <div className="flex items-end gap-2 rounded-2xl border border-border bg-card p-2 shadow-[var(--shadow-soft)] focus-within:border-primary/50 focus-within:ring-2 focus-within:ring-primary/20">
            <Textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  send(input);
                }
              }}
              placeholder="Message Workspace AI..."
              rows={1}
              className="max-h-40 min-h-[40px] flex-1 resize-none border-0 bg-transparent p-2 focus-visible:ring-0"
            />
            <Button onClick={() => send(input)} disabled={!input.trim() || pending} size="icon" className="shrink-0">
              <Send className="h-4 w-4" />
            </Button>
          </div>
          <p className="mt-2 text-center text-[10px] text-muted-foreground">
            AI-generated content may contain inaccuracies. Verify important information.
          </p>
        </div>
      </div>
    </div>
  );
}