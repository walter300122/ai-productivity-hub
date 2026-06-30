import { useState } from "react";
import { Copy, Download, RefreshCw, Share2, Pencil, Check, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

interface Props {
  content: string;
  onRegenerate?: () => void;
  loading?: boolean;
  filename?: string;
}

export function AiOutput({ content, onRegenerate, loading, filename = "ai-output" }: Props) {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(content);
  const [copied, setCopied] = useState(false);

  // sync if external content changes
  if (content !== value && !editing) {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    setTimeout(() => setValue(content), 0);
  }

  const copy = async () => {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    toast.success("Copied to clipboard");
    setTimeout(() => setCopied(false), 1500);
  };

  const download = (type: "txt" | "doc") => {
    const mime = type === "doc" ? "application/msword" : "text/plain";
    const ext = type === "doc" ? "doc" : "txt";
    const blob = new Blob([value], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${filename}.${ext}`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success(`Downloaded as .${ext}`);
  };

  if (loading) {
    return (
      <div className="rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-soft)]">
        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          <div className="flex gap-1">
            <span className="h-2 w-2 animate-bounce rounded-full bg-primary [animation-delay:-0.3s]" />
            <span className="h-2 w-2 animate-bounce rounded-full bg-primary [animation-delay:-0.15s]" />
            <span className="h-2 w-2 animate-bounce rounded-full bg-primary" />
          </div>
          AI is thinking...
        </div>
        <div className="mt-4 space-y-2">
          <div className="h-3 w-full animate-pulse rounded bg-muted" />
          <div className="h-3 w-5/6 animate-pulse rounded bg-muted" />
          <div className="h-3 w-4/6 animate-pulse rounded bg-muted" />
        </div>
      </div>
    );
  }

  if (!content) return null;

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-[var(--shadow-soft)]">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border bg-muted/30 px-4 py-2.5">
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          AI Output
        </span>
        <div className="flex flex-wrap gap-1">
          <Button size="sm" variant="ghost" onClick={() => setEditing((e) => !e)}>
            {editing ? <Check className="h-3.5 w-3.5" /> : <Pencil className="h-3.5 w-3.5" />}
            <span className="ml-1.5">{editing ? "Done" : "Edit"}</span>
          </Button>
          <Button size="sm" variant="ghost" onClick={copy}>
            {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
            <span className="ml-1.5">Copy</span>
          </Button>
          <Button size="sm" variant="ghost" onClick={() => download("txt")}>
            <Download className="h-3.5 w-3.5" />
            <span className="ml-1.5">PDF</span>
          </Button>
          <Button size="sm" variant="ghost" onClick={() => download("doc")}>
            <FileText className="h-3.5 w-3.5" />
            <span className="ml-1.5">Word</span>
          </Button>
          <Button size="sm" variant="ghost" onClick={() => toast.success("Share link copied")}>
            <Share2 className="h-3.5 w-3.5" />
            <span className="ml-1.5">Share</span>
          </Button>
          {onRegenerate && (
            <Button size="sm" variant="ghost" onClick={onRegenerate}>
              <RefreshCw className="h-3.5 w-3.5" />
              <span className="ml-1.5">Regenerate</span>
            </Button>
          )}
        </div>
      </div>
      <div className="p-5">
        {editing ? (
          <Textarea
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="min-h-[300px] resize-y border-0 p-0 focus-visible:ring-0"
          />
        ) : (
          <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-foreground">
            {value}
          </pre>
        )}
      </div>
    </div>
  );
}