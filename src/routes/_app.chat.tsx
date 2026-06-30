import { createFileRoute, Link, Outlet, useNavigate, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { MessageSquare, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { type ChatThread, createThread, loadThreads, saveThreads } from "@/lib/chat-store";

export const Route = createFileRoute("/_app/chat")({
  head: () => ({ meta: [{ title: "AI Workplace Chatbot — Workspace AI" }] }),
  component: ChatLayout,
});

function ChatLayout() {
  const [threads, setThreads] = useState<ChatThread[]>([]);
  const [ready, setReady] = useState(false);
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const activeId = pathname.startsWith("/chat/") ? pathname.split("/")[2] : undefined;

  useEffect(() => {
    if (typeof window === "undefined") return;
    const loaded = loadThreads();
    if (loaded.length === 0) {
      const t = createThread();
      saveThreads([t]);
      setThreads([t]);
      navigate({ to: "/chat/$threadId", params: { threadId: t.id }, replace: true });
    } else {
      setThreads(loaded);
      if (!activeId) {
        navigate({ to: "/chat/$threadId", params: { threadId: loaded[0].id }, replace: true });
      }
    }
    setReady(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // re-read threads when storage changes (e.g. from child route after sending a message)
  useEffect(() => {
    const onChange = () => setThreads(loadThreads());
    window.addEventListener("workspace-threads-changed", onChange);
    window.addEventListener("storage", onChange);
    return () => {
      window.removeEventListener("workspace-threads-changed", onChange);
      window.removeEventListener("storage", onChange);
    };
  }, []);

  const newChat = () => {
    const t = createThread();
    const next = [t, ...loadThreads()];
    saveThreads(next);
    setThreads(next);
    navigate({ to: "/chat/$threadId", params: { threadId: t.id } });
  };

  const deleteThread = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const remaining = loadThreads().filter((t) => t.id !== id);
    if (remaining.length === 0) {
      const t = createThread();
      saveThreads([t]);
      setThreads([t]);
      navigate({ to: "/chat/$threadId", params: { threadId: t.id }, replace: true });
    } else {
      saveThreads(remaining);
      setThreads(remaining);
      if (activeId === id) {
        navigate({ to: "/chat/$threadId", params: { threadId: remaining[0].id }, replace: true });
      }
    }
  };

  return (
    <div className="mx-auto h-[calc(100vh-8rem)] max-w-7xl">
      <div className="grid h-full grid-cols-1 gap-4 md:grid-cols-[280px_1fr]">
        {/* Thread list */}
        <aside className="hidden flex-col overflow-hidden rounded-2xl border border-border bg-card md:flex">
          <div className="flex items-center justify-between border-b border-border p-3">
            <p className="text-sm font-semibold">Conversations</p>
            <Button size="sm" onClick={newChat} className="h-8">
              <Plus className="h-3.5 w-3.5" /> New
            </Button>
          </div>
          <div className="flex-1 overflow-y-auto p-2">
            {threads.length === 0 && ready && (
              <p className="px-3 py-6 text-center text-xs text-muted-foreground">No conversations yet</p>
            )}
            <div className="space-y-1">
              {threads.map((t) => {
                const active = t.id === activeId;
                return (
                  <div key={t.id} className="group relative">
                    <Link
                      to="/chat/$threadId"
                      params={{ threadId: t.id }}
                      className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition ${
                        active
                          ? "bg-accent text-accent-foreground"
                          : "hover:bg-muted text-foreground"
                      }`}
                    >
                      <MessageSquare className="h-3.5 w-3.5 shrink-0 opacity-60" />
                      <span className="truncate">{t.title}</span>
                    </Link>
                    <button
                      onClick={(e) => deleteThread(t.id, e)}
                      className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded p-1 text-muted-foreground opacity-0 transition hover:bg-destructive/10 hover:text-destructive group-hover:opacity-100"
                      aria-label="Delete conversation"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </aside>

        {/* Active chat */}
        <Outlet />
      </div>
    </div>
  );
}