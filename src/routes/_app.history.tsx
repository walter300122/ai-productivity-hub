import { createFileRoute } from "@tanstack/react-router";
import { History, Mail, FileText, Search, MessageSquare, CalendarCheck } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/_app/history")({
  head: () => ({ meta: [{ title: "AI History — Workspace AI" }] }),
  component: HistoryPage,
});

const items = [
  { kind: "Email", icon: Mail, title: "Follow-up to Q3 budget review", preview: "Hi Sarah, just following up on...", when: "12 min ago" },
  { kind: "Summary", icon: FileText, title: "Product sync — Nov 12 notes", preview: "Team aligned on Q4 priorities...", when: "1 hr ago" },
  { kind: "Research", icon: Search, title: "Competitor analysis: AI productivity tools", preview: "Summary: The market is...", when: "3 hr ago" },
  { kind: "Chat", icon: MessageSquare, title: "Brainstorm: launch announcement angles", preview: "Here are 10 fresh angles...", when: "Yesterday" },
  { kind: "Plan", icon: CalendarCheck, title: "Weekly planner — Nov 11", preview: "09:00 — Review OKRs...", when: "Yesterday" },
  { kind: "Email", icon: Mail, title: "Thank-you note to new client", preview: "Dear Marcus, thank you so much...", when: "2 days ago" },
  { kind: "Research", icon: Search, title: "Trends in remote team productivity", preview: "Key insights show that...", when: "3 days ago" },
];

function HistoryPage() {
  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader
        icon={<History className="h-5 w-5" />}
        title="AI History"
        description="Everything you've created with Workspace AI in one place."
      />
      <Card>
        <CardContent className="divide-y divide-border p-0">
          {items.map((it, i) => (
            <div key={i} className="flex items-start gap-3 p-4 transition hover:bg-muted/30">
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-accent/40 text-primary">
                <it.icon className="h-[18px] w-[18px]" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="truncate font-medium">{it.title}</p>
                  <Badge variant="secondary" className="text-[10px]">{it.kind}</Badge>
                </div>
                <p className="mt-0.5 truncate text-sm text-muted-foreground">{it.preview}</p>
              </div>
              <span className="shrink-0 text-xs text-muted-foreground">{it.when}</span>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}