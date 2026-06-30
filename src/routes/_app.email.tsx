import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Mail, Sparkles } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { AiOutput } from "@/components/ai-output";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const Route = createFileRoute("/_app/email")({
  head: () => ({ meta: [{ title: "Smart Email Generator — Workspace AI" }] }),
  component: EmailPage,
});

const tones = [
  "Formal", "Friendly", "Persuasive", "Apology",
  "Follow-up", "Thank-you", "Job Application", "Complaint", "Customer Support",
];

function generateMockEmail(d: {
  recipient: string; subject: string; purpose: string;
  context: string; tone: string; length: string;
}) {
  const greeting = d.tone === "Friendly" ? `Hi ${d.recipient || "there"},` : `Dear ${d.recipient || "Recipient"},`;
  const opener: Record<string, string> = {
    Formal: "I hope this message finds you well.",
    Friendly: "Hope you're having a great week!",
    Persuasive: "I'm reaching out with an opportunity I believe will be highly valuable to you.",
    Apology: "I want to sincerely apologize for the recent inconvenience.",
    "Follow-up": "I'm following up on our previous conversation.",
    "Thank-you": "I wanted to take a moment to thank you.",
    "Job Application": "I am writing to express my strong interest in the role.",
    Complaint: "I'm writing to bring an issue to your attention.",
    "Customer Support": "Thank you for reaching out — I'm happy to help.",
  };
  const body = d.purpose
    ? `${opener[d.tone] || ""}\n\nRegarding ${d.purpose.toLowerCase()}, ${d.context || "I wanted to share a few thoughts and next steps."}\n\nPlease let me know if you have any questions, or if there's a time this week that works for a quick discussion.`
    : "I wanted to share a quick update and outline a few next steps.";
  return `Subject: ${d.subject || "(no subject)"}\n\n${greeting}\n\n${body}\n\nBest regards,\nAlex`;
}

function EmailPage() {
  const [form, setForm] = useState({
    recipient: "", subject: "", purpose: "", context: "",
    tone: "Formal", length: "Medium",
  });
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  const generate = () => {
    setLoading(true);
    setOutput("");
    setTimeout(() => {
      setOutput(generateMockEmail(form));
      setLoading(false);
    }, 900);
  };

  const set = (k: keyof typeof form) => (v: string) => setForm((f) => ({ ...f, [k]: v }));

  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader
        icon={<Mail className="h-5 w-5" />}
        title="Smart Email Generator"
        description="Draft polished, on-brand emails in seconds with the right tone."
      />

      <div className="grid gap-5 lg:grid-cols-5">
        <Card className="lg:col-span-2">
          <CardContent className="space-y-4 p-5">
            <div className="space-y-1.5">
              <Label>Recipient</Label>
              <Input
                placeholder="e.g. Sarah Chen"
                value={form.recipient}
                onChange={(e) => set("recipient")(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Subject</Label>
              <Input
                placeholder="e.g. Project update"
                value={form.subject}
                onChange={(e) => set("subject")(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Purpose</Label>
              <Input
                placeholder="e.g. Schedule a follow-up call"
                value={form.purpose}
                onChange={(e) => set("purpose")(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Additional context</Label>
              <Textarea
                rows={4}
                placeholder="Any specifics: deadlines, names, key points..."
                value={form.context}
                onChange={(e) => set("context")(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Tone</Label>
                <Select value={form.tone} onValueChange={set("tone")}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {tones.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Length</Label>
                <Select value={form.length} onValueChange={set("length")}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Short">Short</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="Long">Long</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Button onClick={generate} disabled={loading} className="w-full" size="lg">
              <Sparkles className="mr-2 h-4 w-4" />
              {loading ? "Generating..." : "Generate Email"}
            </Button>
          </CardContent>
        </Card>

        <div className="lg:col-span-3">
          {output || loading ? (
            <AiOutput
              content={output}
              loading={loading}
              onRegenerate={generate}
              filename={`email-${form.subject || "draft"}`}
            />
          ) : (
            <div className="grid h-full min-h-[400px] place-items-center rounded-2xl border-2 border-dashed border-border bg-muted/20 p-8 text-center">
              <div>
                <div
                  className="mx-auto grid h-14 w-14 place-items-center rounded-2xl text-white"
                  style={{ background: "var(--gradient-primary)" }}
                >
                  <Mail className="h-6 w-6" />
                </div>
                <p className="mt-4 font-semibold">Your email will appear here</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Fill in the details on the left and hit Generate.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}