import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { BookMarked, Copy, Check, Search } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/prompts")({
  head: () => ({ meta: [{ title: "Prompt Library — Workspace AI" }] }),
  component: PromptsPage,
});

const prompts = [
  { cat: "Business Email", title: "Cold outreach to a prospect", body: "Write a concise cold email to {{name}} at {{company}} introducing {{product}}, highlighting one specific value prop and asking for a 15-min call." },
  { cat: "Business Email", title: "Polite payment reminder", body: "Draft a polite but firm payment reminder email for invoice {{number}}, due {{date}}, offering flexible options." },
  { cat: "Research", title: "Compare two approaches", body: "Compare {{approach A}} and {{approach B}} for {{use case}}. Cover trade-offs, cost, time, and risk in a table." },
  { cat: "Research", title: "Executive briefing", body: "Create a 1-page executive briefing on {{topic}}, including TL;DR, key insights, risks, and recommended next steps." },
  { cat: "Meeting", title: "Standup agenda", body: "Generate a 15-min standup agenda for a team of {{n}} covering blockers, priorities, and one focus topic." },
  { cat: "Meeting", title: "Post-mortem template", body: "Build a post-mortem template covering what happened, impact, root cause, action items, and learnings." },
  { cat: "Project Planning", title: "Kickoff plan", body: "Draft a project kickoff plan for {{project}}: goals, scope, milestones, owners, risks." },
  { cat: "Marketing", title: "Launch announcement", body: "Write a launch announcement for {{product}}: headline, 2-sentence pitch, 3 features, CTA." },
  { cat: "Customer Service", title: "Refund response", body: "Reply to a customer refund request with empathy, the policy, and the next steps clearly listed." },
  { cat: "Resume", title: "Bullet point rewrite", body: "Rewrite this resume bullet to be outcome-oriented and quantified: {{bullet}}." },
  { cat: "Cover Letter", title: "Targeted cover letter", body: "Write a 250-word cover letter for {{role}} at {{company}}, weaving in 3 specific accomplishments from my background." },
  { cat: "Brainstorming", title: "10 fresh angles", body: "Give me 10 fresh angles on {{topic}}, ranked by originality, with a one-line rationale each." },
];

const categories = ["All", ...Array.from(new Set(prompts.map((p) => p.cat)))];

function PromptsPage() {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("All");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filtered = prompts.filter((p) => {
    const matchCat = cat === "All" || p.cat === cat;
    const matchQ = !q.trim() ||
      p.title.toLowerCase().includes(q.toLowerCase()) ||
      p.body.toLowerCase().includes(q.toLowerCase());
    return matchCat && matchQ;
  });

  const copy = async (p: typeof prompts[number]) => {
    await navigator.clipboard.writeText(p.body);
    setCopiedId(p.title);
    toast.success("Prompt copied");
    setTimeout(() => setCopiedId(null), 1500);
  };

  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader
        icon={<BookMarked className="h-5 w-5" />}
        title="Prompt Library"
        description="Ready-made templates for emails, research, planning, and more."
      />

      <div className="mb-5 flex flex-wrap items-center gap-3">
        <div className="relative max-w-sm flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search prompts..." value={q} onChange={(e) => setQ(e.target.value)} className="pl-9" />
        </div>
        <div className="flex flex-wrap gap-1.5">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setCat(c)}
              className={`rounded-full px-3 py-1 text-xs font-medium transition ${
                cat === c ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-accent"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((p) => (
          <Card key={p.title} className="group transition hover:shadow-[var(--shadow-elegant)]">
            <CardContent className="flex h-full flex-col p-5">
              <Badge variant="secondary" className="mb-2 w-fit text-[10px]">{p.cat}</Badge>
              <h3 className="font-semibold leading-tight">{p.title}</h3>
              <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">{p.body}</p>
              <button
                onClick={() => copy(p)}
                className="mt-4 flex items-center gap-1.5 self-start rounded-md bg-accent/50 px-2.5 py-1.5 text-xs font-medium text-primary transition hover:bg-primary hover:text-primary-foreground"
              >
                {copiedId === p.title ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                {copiedId === p.title ? "Copied" : "Copy prompt"}
              </button>
            </CardContent>
          </Card>
        ))}
        {filtered.length === 0 && (
          <p className="col-span-full py-10 text-center text-sm text-muted-foreground">No prompts match your search.</p>
        )}
      </div>
    </div>
  );
}