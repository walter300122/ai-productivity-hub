import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { FileText, Sparkles } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { AiOutput } from "@/components/ai-output";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_app/meetings")({
  head: () => ({ meta: [{ title: "Meeting Notes Summarizer — Workspace AI" }] }),
  component: MeetingsPage,
});

function summarize(notes: string) {
  const sample = notes.trim() || "(no notes provided)";
  const snippet = sample.slice(0, 120) + (sample.length > 120 ? "..." : "");
  return `EXECUTIVE SUMMARY
The team aligned on Q4 priorities, reviewed the launch timeline, and resolved several open dependencies. Overall sentiment was positive with clear ownership assigned.

KEY DISCUSSION POINTS
• Product launch is on track for Dec 15
• Marketing requires final assets by Dec 1
• Engineering flagged a backend capacity risk
• Customer feedback from beta is overwhelmingly positive

ACTION ITEMS
1. Sarah — finalize launch landing page copy (due Nov 28)
2. Marcus — provision additional backend capacity (due Dec 5)
3. Priya — coordinate press outreach (due Dec 8)
4. Alex — share weekly status updates with leadership

DEADLINES
• Nov 28 — Final marketing assets
• Dec 1 — Press kit ready
• Dec 5 — Infrastructure scaling complete
• Dec 15 — Public launch

RESPONSIBILITIES
• Sarah Chen → Marketing & Comms
• Marcus Lee → Infrastructure
• Priya Patel → PR & Partnerships
• Alex (you) → Program management

IMPORTANT DECISIONS
• Approved a 10% budget increase for paid acquisition
• Postponed mobile app launch to Q1 to focus resources

POTENTIAL RISKS
• Backend capacity scaling may slip if vendor SLAs aren't met
• Marketing asset turnaround is tight; consider buffer time

FOLLOW-UP TASKS
• Schedule a risk review for Nov 30
• Send recap email to all stakeholders today
• Re-evaluate timeline on Dec 8

Notes excerpt processed: "${snippet}"`;
}

function MeetingsPage() {
  const [notes, setNotes] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  const run = () => {
    setLoading(true);
    setOutput("");
    setTimeout(() => {
      setOutput(summarize(notes));
      setLoading(false);
    }, 1100);
  };

  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader
        icon={<FileText className="h-5 w-5" />}
        title="Meeting Notes Summarizer"
        description="Turn long meeting notes into executive summaries, action items, and decisions."
      />

      <div className="grid gap-5 lg:grid-cols-5">
        <Card className="lg:col-span-2">
          <CardContent className="space-y-4 p-5">
            <div className="space-y-1.5">
              <Label>Paste your meeting notes</Label>
              <Textarea
                rows={16}
                placeholder="Paste raw meeting notes, transcripts, or bullet points here..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>
            <Button onClick={run} disabled={loading} size="lg" className="w-full">
              <Sparkles className="mr-2 h-4 w-4" />
              {loading ? "Summarizing..." : "Summarize Notes"}
            </Button>
          </CardContent>
        </Card>

        <div className="lg:col-span-3">
          {output || loading ? (
            <AiOutput
              content={output}
              loading={loading}
              onRegenerate={run}
              filename="meeting-summary"
            />
          ) : (
            <div className="grid h-full min-h-[400px] place-items-center rounded-2xl border-2 border-dashed border-border bg-muted/20 p-8 text-center">
              <div>
                <div
                  className="mx-auto grid h-14 w-14 place-items-center rounded-2xl text-white"
                  style={{ background: "var(--gradient-primary)" }}
                >
                  <FileText className="h-6 w-6" />
                </div>
                <p className="mt-4 font-semibold">Your summary will appear here</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Paste notes and the AI will extract decisions, action items, and risks.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}