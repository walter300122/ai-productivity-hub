import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Settings as SettingsIcon, Moon, Sun, Bell, Globe, User, Shield } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";

export const Route = createFileRoute("/_app/settings")({
  head: () => ({ meta: [{ title: "Settings — Workspace AI" }] }),
  component: SettingsPage,
});

function SettingsPage() {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const stored = localStorage.getItem("theme");
    const t = stored === "dark" ? "dark" : "light";
    setTheme(t);
    document.documentElement.classList.toggle("dark", t === "dark");
  }, []);

  const apply = (t: "light" | "dark") => {
    setTheme(t);
    document.documentElement.classList.toggle("dark", t === "dark");
    localStorage.setItem("theme", t);
  };

  return (
    <div className="mx-auto max-w-4xl">
      <PageHeader
        icon={<SettingsIcon className="h-5 w-5" />}
        title="Settings"
        description="Customize your workspace and preferences."
      />

      <div className="space-y-5">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <User className="h-4 w-4" /> Profile
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label>Full name</Label>
              <Input defaultValue="Alex Kim" />
            </div>
            <div className="space-y-1.5">
              <Label>Email</Label>
              <Input defaultValue="alex@workspace.ai" type="email" />
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <Label>Job title</Label>
              <Input defaultValue="Product Manager" />
            </div>
            <div className="sm:col-span-2">
              <Button>Save changes</Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Appearance</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-2">
            <button
              onClick={() => apply("light")}
              className={`flex items-center gap-3 rounded-xl border-2 p-4 text-left transition ${
                theme === "light" ? "border-primary bg-accent/30" : "border-border hover:bg-muted/30"
              }`}
            >
              <Sun className="h-5 w-5 text-primary" />
              <div>
                <p className="font-semibold">Light mode</p>
                <p className="text-xs text-muted-foreground">Bright & clean</p>
              </div>
            </button>
            <button
              onClick={() => apply("dark")}
              className={`flex items-center gap-3 rounded-xl border-2 p-4 text-left transition ${
                theme === "dark" ? "border-primary bg-accent/30" : "border-border hover:bg-muted/30"
              }`}
            >
              <Moon className="h-5 w-5 text-primary" />
              <div>
                <p className="font-semibold">Dark mode</p>
                <p className="text-xs text-muted-foreground">Easy on the eyes</p>
              </div>
            </button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Bell className="h-4 w-4" /> Notifications
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              ["Email digests", "Weekly summary of your AI activity"],
              ["Task reminders", "Get reminded about upcoming deadlines"],
              ["New feature updates", "Hear about new Workspace AI features"],
            ].map(([t, d]) => (
              <div key={t} className="flex items-center justify-between rounded-lg border border-border p-3">
                <div>
                  <p className="text-sm font-medium">{t}</p>
                  <p className="text-xs text-muted-foreground">{d}</p>
                </div>
                <Switch defaultChecked />
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Globe className="h-4 w-4" /> Language
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Select defaultValue="en">
              <SelectTrigger className="max-w-xs"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="es">Español</SelectItem>
                <SelectItem value="fr">Français</SelectItem>
                <SelectItem value="de">Deutsch</SelectItem>
                <SelectItem value="ja">日本語</SelectItem>
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Shield className="h-4 w-4" /> Privacy
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between rounded-lg border border-border p-3">
              <div>
                <p className="text-sm font-medium">Use my data to improve AI</p>
                <p className="text-xs text-muted-foreground">Anonymized and aggregated</p>
              </div>
              <Switch />
            </div>
            <Button variant="outline" className="w-full sm:w-auto">Export my data</Button>
          </CardContent>
        </Card>

        <div className="rounded-2xl border border-dashed border-border bg-muted/20 p-4 text-xs text-muted-foreground">
          <p className="mb-1 font-semibold text-foreground">Responsible AI notice</p>
          AI-generated content may occasionally contain inaccuracies. Users should verify important information before relying on it for professional, legal, financial, or medical decisions. This application is designed to assist productivity, not replace human judgment.
        </div>
      </div>
    </div>
  );
}