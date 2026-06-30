import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Search, Sparkles, Upload } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { AiOutput } from "@/components/ai-output";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const Route = createFileRoute("/_app/research")({
  head: () => ({ meta: [{ title: "AI Research Assistant — Workspace AI" }] }),
  component: ResearchPage,
});

function research(query: string) {
  const q = query.trim() || "the topic";
  return `SUMMARY
${q.charAt(0).toUpperCase() + q.slice(1)} is a rapidly evolving area with significant implications for productivity, decision-making, and modern workflows. The current consensus suggests strong upside when applied thoughtfully, balanced against governance and quality risks.

KEY INSIGHTS
• Adoption has accelerated 3x in the past 18 months
• Best results come from clear problem framing and iterative refinement
• Cross-functional teams adopt faster than siloed ones
• Outcomes correlate strongly with data quality and human review

ADVANTAGES
• Dramatic time savings on repetitive cognitive work
• Higher consistency and quality of output
• Lower barrier to specialized expertise
• Better information synthesis at scale

DISADVANTAGES
• Risk of overreliance and skill atrophy
• Potential for inaccuracies and hallucinations
• Privacy and compliance considerations
• Implementation requires change management

RECOMMENDATIONS
1. Start with one high-leverage workflow
2. Establish clear quality checks and review loops
3. Train teams on prompt design and verification
4. Measure impact monthly and iterate

SUGGESTED NEXT STEPS
• Identify 3 candidate workflows in the next 2 weeks
• Run a 30-day pilot with a small team
• Define success metrics up front
• Share learnings broadly

KEY TAKEAWAYS
→ The opportunity is real but requires deliberate implementation.
→ Focus on outcomes, not features.
→ Human judgment remains the final filter.

REFERENCES
[1] Industry overview report, 2024
[2] Workplace productivity benchmarks, Q3 2024
[3] Case study collection, leading SaaS platforms
[4] Best-practice guide, change management for AI tools`;
}

function ResearchPage() {
  const [q, setQ] = useState("");
  const [pasted, setPasted] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  const run = (text: string) => {
    setLoading(true);
    setOutput("");
    setTimeout(() => {
      setOutput(research(text));
      setLoading(false);
    }, 1200);
  };

  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader
        icon={<Search className="h-5 w-5" />}
        title="AI Research Assistant"
        description="Ask anything, summarize articles, or upload documents for deep insights."
      />

      <div className="grid gap-5 lg:grid-cols-5">
        <Card className="lg:col-span-2">
          <CardContent className="p-5">
            <Tabs defaultValue="ask">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="ask">Ask</TabsTrigger>
                <TabsTrigger value="paste">Paste</TabsTrigger>
                <TabsTrigger value="upload">Upload</TabsTrigger>
              </TabsList>
              <TabsContent value="ask" className="space-y-4">
                <div className="space-y-1.5">
                  <Label>Research question</Label>
                  <Textarea
                    rows={6}
                    placeholder="e.g. What are the most effective AI productivity tools for remote teams?"
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                  />
                </div>
                <Button onClick={() => run(q)} disabled={loading || !q.trim()} className="w-full" size="lg">
                  <Sparkles className="mr-2 h-4 w-4" /> Research
                </Button>
              </TabsContent>
              <TabsContent value="paste" className="space-y-4">
                <div className="space-y-1.5">
                  <Label>Paste article or text</Label>
                  <Textarea
                    rows={10}
                    placeholder="Paste the content you want summarized..."
                    value={pasted}
                    onChange={(e) => setPasted(e.target.value)}
                  />
                </div>
                <Button onClick={() => run(pasted)} disabled={loading || !pasted.trim()} className="w-full" size="lg">
                  <Sparkles className="mr-2 h-4 w-4" /> Summarize
                </Button>
              </TabsContent>
              <TabsContent value="upload">
                <label className="grid min-h-[220px] cursor-pointer place-items-center rounded-xl border-2 border-dashed border-border bg-muted/20 p-6 text-center transition hover:bg-muted/40">
                  <div>
                    <Upload className="mx-auto h-7 w-7 text-muted-foreground" />
                    <p className="mt-2 text-sm font-medium">Drop a text document or click to upload</p>
                    <p className="text-xs text-muted-foreground">TXT, PDF, DOCX · up to 10MB</p>
                  </div>
                  <input type="file" className="hidden" onChange={() => run("uploaded document content")} />
                </label>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <div className="lg:col-span-3">
          {output || loading ? (
            <AiOutput
              content={output}
              loading={loading}
              onRegenerate={() => run(q || pasted)}
              filename="research-summary"
            />
          ) : (
            <div className="grid h-full min-h-[400px] place-items-center rounded-2xl border-2 border-dashed border-border bg-muted/20 p-8 text-center">
              <div>
                <div
                  className="mx-auto grid h-14 w-14 place-items-center rounded-2xl text-white"
                  style={{ background: "var(--gradient-primary)" }}
                >
                  <Search className="h-6 w-6" />
                </div>
                <p className="mt-4 font-semibold">Insights will appear here</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Ask, paste, or upload — get a clean summary with key insights and next steps.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}