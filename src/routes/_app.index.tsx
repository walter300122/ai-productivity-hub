import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Mail,
  FileText,
  CalendarCheck,
  Search,
  MessageSquare,
  TrendingUp,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowUpRight,
  Zap,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

export const Route = createFileRoute("/_app/")({
  head: () => ({
    meta: [
      { title: "Dashboard — Workspace AI" },
      { name: "description", content: "Your AI-powered productivity command center." },
    ],
  }),
  component: Dashboard,
});

const stats = [
  { label: "Tasks completed today", value: "14", delta: "+3", icon: CheckCircle2, color: "var(--success)" },
  { label: "Upcoming deadlines", value: "6", delta: "2 today", icon: Clock, color: "var(--warning)" },
  { label: "Emails generated", value: "32", delta: "+8 this week", icon: Mail, color: "var(--primary)" },
  { label: "Research sessions", value: "11", delta: "+2", icon: Search, color: "var(--primary-glow)" },
];

const quickActions = [
  { title: "Generate Email", desc: "Draft professional emails", url: "/email", icon: Mail },
  { title: "Summarize Meeting", desc: "Extract key points & actions", url: "/meetings", icon: FileText },
  { title: "Plan My Day", desc: "AI-built daily schedule", url: "/tasks", icon: CalendarCheck },
  { title: "Research a Topic", desc: "Deep insights in seconds", url: "/research", icon: Search },
  { title: "Ask the Assistant", desc: "Chat with Workspace AI", url: "/chat", icon: MessageSquare },
  { title: "Browse Prompts", desc: "Ready-made templates", url: "/prompts", icon: Sparkles },
];

const activity = [
  { type: "Email", title: "Follow-up to Q3 budget review", time: "12 min ago" },
  { type: "Summary", title: "Product sync — Nov 12 meeting notes", time: "1 hr ago" },
  { type: "Research", title: "Competitor analysis: AI productivity tools", time: "3 hr ago" },
  { type: "Task", title: "Weekly planner generated", time: "Yesterday" },
  { type: "Email", title: "Thank-you note to new client", time: "Yesterday" },
];

function Dashboard() {
  return (
    <div className="mx-auto max-w-7xl space-y-6">
      {/* Hero */}
      <div
        className="overflow-hidden rounded-3xl p-6 text-white shadow-[var(--shadow-elegant)] md:p-8"
        style={{ background: "var(--gradient-primary)" }}
      >
        <div className="flex flex-wrap items-center justify-between gap-6">
          <div className="min-w-0 max-w-xl">
            <div className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-medium backdrop-blur">
              <Zap className="h-3 w-3" /> AI-powered workspace
            </div>
            <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
              Good morning, Alex 👋
            </h1>
            <p className="mt-2 text-sm text-white/80 md:text-base">
              You have 6 deadlines this week. Let's tackle the most important ones first — I've drafted a focus plan for you.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <Button asChild variant="secondary" className="bg-white text-primary hover:bg-white/90">
                <Link to="/tasks">View today's plan <ArrowUpRight className="ml-1 h-4 w-4" /></Link>
              </Button>
              <Button asChild variant="ghost" className="text-white hover:bg-white/15 hover:text-white">
                <Link to="/chat">Ask the assistant</Link>
              </Button>
            </div>
          </div>
          <div className="hidden md:block">
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="rounded-xl bg-white/10 p-4 backdrop-blur">
                <p className="text-white/70 text-xs">Weekly progress</p>
                <p className="mt-1 text-2xl font-bold">78%</p>
                <Progress value={78} className="mt-2 h-1.5 bg-white/20" />
              </div>
              <div className="rounded-xl bg-white/10 p-4 backdrop-blur">
                <p className="text-white/70 text-xs">AI assists used</p>
                <p className="mt-1 text-2xl font-bold">147</p>
                <p className="mt-2 text-xs text-white/70">+22% vs last week</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
        {stats.map((s) => (
          <Card key={s.label} className="shadow-[var(--shadow-soft)] transition hover:shadow-[var(--shadow-elegant)]">
            <CardContent className="p-4 md:p-5">
              <div className="flex items-start justify-between">
                <div
                  className="grid h-9 w-9 place-items-center rounded-lg"
                  style={{ backgroundColor: `color-mix(in oklab, ${s.color} 15%, transparent)`, color: s.color }}
                >
                  <s.icon className="h-[18px] w-[18px]" />
                </div>
                <span className="text-xs font-medium text-muted-foreground">{s.delta}</span>
              </div>
              <p className="mt-3 text-2xl font-bold tracking-tight">{s.value}</p>
              <p className="mt-0.5 text-xs text-muted-foreground">{s.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick actions */}
      <div>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Quick actions
        </h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {quickActions.map((a) => (
            <Link key={a.url} to={a.url} className="group">
              <Card className="h-full transition hover:-translate-y-0.5 hover:shadow-[var(--shadow-elegant)]">
                <CardContent className="flex items-start gap-3 p-5">
                  <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-accent/60 text-primary transition group-hover:bg-primary group-hover:text-primary-foreground">
                    <a.icon className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="flex items-center gap-1 font-semibold">
                      {a.title}
                      <ArrowUpRight className="h-3.5 w-3.5 -translate-x-1 opacity-0 transition group-hover:translate-x-0 group-hover:opacity-100" />
                    </p>
                    <p className="mt-0.5 text-sm text-muted-foreground">{a.desc}</p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* Activity + Chart */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">Recent activity</CardTitle>
            <Button asChild variant="ghost" size="sm">
              <Link to="/history">View all</Link>
            </Button>
          </CardHeader>
          <CardContent className="space-y-2">
            {activity.map((a, i) => (
              <div key={i} className="flex items-center gap-3 rounded-lg p-2 transition hover:bg-muted/50">
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-md bg-accent/50 text-[10px] font-bold uppercase tracking-wider text-primary">
                  {a.type.slice(0, 2)}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{a.title}</p>
                  <p className="text-xs text-muted-foreground">{a.type} · {a.time}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Productivity</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="mb-1.5 flex justify-between text-xs">
                <span className="text-muted-foreground">Focus time</span>
                <span className="font-semibold">4.2h / 6h</span>
              </div>
              <Progress value={70} className="h-2" />
            </div>
            <div>
              <div className="mb-1.5 flex justify-between text-xs">
                <span className="text-muted-foreground">Tasks completion</span>
                <span className="font-semibold">14 / 18</span>
              </div>
              <Progress value={78} className="h-2" />
            </div>
            <div>
              <div className="mb-1.5 flex justify-between text-xs">
                <span className="text-muted-foreground">Meetings prepped</span>
                <span className="font-semibold">3 / 4</span>
              </div>
              <Progress value={75} className="h-2" />
            </div>
            <div className="rounded-lg border border-dashed border-border bg-muted/30 p-3">
              <p className="flex items-center gap-1.5 text-xs font-semibold">
                <TrendingUp className="h-3.5 w-3.5 text-[color:var(--success)]" />
                Up 22% from last week
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                You're on track to beat your personal best.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}