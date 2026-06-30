import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Folder, Search, FileText, Trash2, Pencil, MoreVertical, FolderPlus, Plus } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/_app/documents")({
  head: () => ({ meta: [{ title: "Saved Documents — Workspace AI" }] }),
  component: DocumentsPage,
});

const folders = ["All", "Emails", "Research", "Meeting Notes", "Plans"];

const seed = [
  { name: "Client proposal — Acme Co.", folder: "Emails", updated: "2h ago" },
  { name: "Q4 OKR review", folder: "Meeting Notes", updated: "Yesterday" },
  { name: "Competitor scan — productivity SaaS", folder: "Research", updated: "2 days ago" },
  { name: "Weekly plan — Nov 11", folder: "Plans", updated: "3 days ago" },
  { name: "Thank-you note — new client", folder: "Emails", updated: "5 days ago" },
  { name: "Remote team trends summary", folder: "Research", updated: "1 wk ago" },
];

function DocumentsPage() {
  const [docs, setDocs] = useState(seed);
  const [folder, setFolder] = useState("All");
  const [q, setQ] = useState("");

  const filtered = docs.filter((d) => {
    const matchF = folder === "All" || d.folder === folder;
    const matchQ = !q.trim() || d.name.toLowerCase().includes(q.toLowerCase());
    return matchF && matchQ;
  });

  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader
        icon={<Folder className="h-5 w-5" />}
        title="Saved Documents"
        description="Organize and search every AI-generated document you've saved."
        actions={
          <>
            <Button variant="outline" size="sm"><FolderPlus className="mr-1.5 h-3.5 w-3.5" /> New folder</Button>
            <Button size="sm"><Plus className="mr-1.5 h-3.5 w-3.5" /> New document</Button>
          </>
        }
      />

      <div className="grid gap-5 md:grid-cols-[200px_1fr]">
        <aside className="space-y-1">
          {folders.map((f) => (
            <button
              key={f}
              onClick={() => setFolder(f)}
              className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm transition ${
                folder === f ? "bg-accent text-accent-foreground font-medium" : "hover:bg-muted text-muted-foreground"
              }`}
            >
              <Folder className="h-3.5 w-3.5" />
              {f}
            </button>
          ))}
        </aside>

        <div>
          <div className="relative mb-4 max-w-sm">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search documents..." value={q} onChange={(e) => setQ(e.target.value)} className="pl-9" />
          </div>
          <Card>
            <CardContent className="divide-y divide-border p-0">
              {filtered.map((d, i) => (
                <div key={i} className="flex items-center gap-3 p-3.5 transition hover:bg-muted/30">
                  <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-accent/40 text-primary">
                    <FileText className="h-4 w-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{d.name}</p>
                    <p className="text-xs text-muted-foreground">Updated {d.updated}</p>
                  </div>
                  <Badge variant="secondary" className="hidden text-[10px] sm:inline-flex">{d.folder}</Badge>
                  <Button size="icon" variant="ghost" className="h-8 w-8"><Pencil className="h-3.5 w-3.5" /></Button>
                  <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => setDocs((ds) => ds.filter((_, j) => j !== i))}>
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                  <Button size="icon" variant="ghost" className="h-8 w-8"><MoreVertical className="h-3.5 w-3.5" /></Button>
                </div>
              ))}
              {filtered.length === 0 && (
                <p className="py-10 text-center text-sm text-muted-foreground">No documents found.</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}