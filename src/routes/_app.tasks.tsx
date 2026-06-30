import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { CalendarCheck, Sparkles, Plus, X, Clock, Coffee } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";

export const Route = createFileRoute("/_app/tasks")({
  head: () => ({ meta: [{ title: "AI Task Planner — Workspace AI" }] }),
  component: TasksPage,
});

type Task = { id: string; title: string; priority: "High" | "Medium" | "Low"; deadline: string };

type ScheduleItem = { time: string; title: string; kind: "task" | "break"; priority?: string };

function buildSchedule(tasks: Task[], start: string, end: string): ScheduleItem[] {
  const sorted = [...tasks].sort((a, b) => {
    const order = { High: 0, Medium: 1, Low: 2 };
    return order[a.priority] - order[b.priority];
  });
  const items: ScheduleItem[] = [];
  const [sh] = start.split(":").map(Number);
  let h = sh || 9;
  for (let i = 0; i < sorted.length; i++) {
    items.push({
      time: `${String(h).padStart(2, "0")}:00`,
      title: sorted[i].title,
      kind: "task",
      priority: sorted[i].priority,
    });
    h += 1;
    if (i === 1) {
      items.push({ time: `${String(h).padStart(2, "0")}:00`, title: "Coffee break", kind: "break" });
      h += 1;
    }
  }
  return items;
}

function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([
    { id: "1", title: "Review Q4 OKRs", priority: "High", deadline: "Today" },
    { id: "2", title: "Draft client proposal", priority: "High", deadline: "Tomorrow" },
    { id: "3", title: "Inbox zero", priority: "Low", deadline: "Today" },
  ]);
  const [draft, setDraft] = useState({ title: "", priority: "Medium" as Task["priority"], deadline: "Today" });
  const [start, setStart] = useState("09:00");
  const [end, setEnd] = useState("17:00");
  const [plan, setPlan] = useState<ScheduleItem[] | null>(null);
  const [view, setView] = useState<"day" | "week">("day");
  const [loading, setLoading] = useState(false);

  const add = () => {
    if (!draft.title.trim()) return;
    setTasks((t) => [...t, { ...draft, id: Date.now().toString() }]);
    setDraft({ title: "", priority: "Medium", deadline: "Today" });
  };

  const remove = (id: string) => setTasks((t) => t.filter((x) => x.id !== id));

  const generate = () => {
    setLoading(true);
    setTimeout(() => {
      setPlan(buildSchedule(tasks, start, end));
      setLoading(false);
    }, 800);
  };

  const priorityColor = (p?: string) =>
    p === "High" ? "destructive" : p === "Medium" ? "default" : "secondary";

  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader
        icon={<CalendarCheck className="h-5 w-5" />}
        title="AI Task Planner"
        description="Add your tasks and let AI build an optimized daily schedule."
      />

      <div className="grid gap-5 lg:grid-cols-5">
        <div className="space-y-4 lg:col-span-2">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Today's tasks</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                {tasks.map((t) => (
                  <div key={t.id} className="flex items-center gap-2 rounded-lg border border-border p-2.5">
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{t.title}</p>
                      <p className="text-xs text-muted-foreground">{t.deadline}</p>
                    </div>
                    <Badge variant={priorityColor(t.priority) as never}>{t.priority}</Badge>
                    <Button size="icon" variant="ghost" onClick={() => remove(t.id)} className="h-7 w-7">
                      <X className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                ))}
              </div>
              <div className="space-y-2 rounded-lg bg-muted/30 p-3">
                <Input
                  placeholder="Add a task..."
                  value={draft.title}
                  onChange={(e) => setDraft({ ...draft, title: e.target.value })}
                  onKeyDown={(e) => e.key === "Enter" && add()}
                />
                <div className="grid grid-cols-2 gap-2">
                  <Select value={draft.priority} onValueChange={(v) => setDraft({ ...draft, priority: v as Task["priority"] })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="High">High</SelectItem>
                      <SelectItem value="Medium">Medium</SelectItem>
                      <SelectItem value="Low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={draft.deadline} onValueChange={(v) => setDraft({ ...draft, deadline: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Today">Today</SelectItem>
                      <SelectItem value="Tomorrow">Tomorrow</SelectItem>
                      <SelectItem value="This week">This week</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button onClick={add} variant="secondary" className="w-full">
                  <Plus className="mr-1.5 h-3.5 w-3.5" /> Add task
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Working hours</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs">Start</Label>
                  <Input type="time" value={start} onChange={(e) => setStart(e.target.value)} />
                </div>
                <div>
                  <Label className="text-xs">End</Label>
                  <Input type="time" value={end} onChange={(e) => setEnd(e.target.value)} />
                </div>
              </div>
              <Button onClick={generate} disabled={loading || !tasks.length} className="w-full" size="lg">
                <Sparkles className="mr-2 h-4 w-4" />
                {loading ? "Building plan..." : "Generate Schedule"}
              </Button>
            </CardContent>
          </Card>
        </div>

        <Card className="lg:col-span-3">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="text-base">Your schedule</CardTitle>
            <div className="flex gap-1 rounded-lg bg-muted p-1">
              <Button size="sm" variant={view === "day" ? "default" : "ghost"} onClick={() => setView("day")} className="h-7 px-3">Day</Button>
              <Button size="sm" variant={view === "week" ? "default" : "ghost"} onClick={() => setView("week")} className="h-7 px-3">Week</Button>
            </div>
          </CardHeader>
          <CardContent>
            {!plan && !loading && (
              <div className="grid min-h-[360px] place-items-center text-center">
                <div>
                  <div
                    className="mx-auto grid h-14 w-14 place-items-center rounded-2xl text-white"
                    style={{ background: "var(--gradient-primary)" }}
                  >
                    <CalendarCheck className="h-6 w-6" />
                  </div>
                  <p className="mt-4 font-semibold">Generate your plan</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    AI will arrange tasks by priority and schedule breaks.
                  </p>
                </div>
              </div>
            )}
            {loading && (
              <div className="space-y-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="h-14 animate-pulse rounded-lg bg-muted" />
                ))}
              </div>
            )}
            {plan && !loading && (
              <div className="space-y-2">
                {plan.map((item, i) => (
                  <div
                    key={i}
                    className={`flex items-center gap-3 rounded-xl border p-3 transition ${
                      item.kind === "break" ? "border-dashed bg-muted/30" : "border-border bg-card hover:shadow-[var(--shadow-soft)]"
                    }`}
                  >
                    <div className="grid h-10 w-16 shrink-0 place-items-center rounded-lg bg-accent/40 text-sm font-bold text-primary">
                      {item.time}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium">{item.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {item.kind === "break" ? "15-min break" : "Focus block · 1h"}
                      </p>
                    </div>
                    {item.kind === "task" ? (
                      <Badge variant={priorityColor(item.priority) as never}>{item.priority}</Badge>
                    ) : (
                      <Coffee className="h-4 w-4 text-muted-foreground" />
                    )}
                  </div>
                ))}
                <div className="mt-4 rounded-xl border border-dashed border-border bg-muted/20 p-4">
                  <p className="flex items-center gap-1.5 text-sm font-semibold">
                    <Clock className="h-4 w-4 text-primary" /> Productivity tips
                  </p>
                  <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                    <li>• Tackle high-priority work first — your peak focus is in the morning.</li>
                    <li>• Estimated completion: ~{plan.filter(p => p.kind === "task").length}h of deep work.</li>
                    <li>• Batch shallow tasks (inbox, replies) into a single 45-min block.</li>
                  </ul>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}