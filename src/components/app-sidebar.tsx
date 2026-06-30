import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Mail,
  FileText,
  CalendarCheck,
  Search,
  MessageSquare,
  BookMarked,
  History,
  Folder,
  Settings,
  Sparkles,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
} from "@/components/ui/sidebar";

const workspace = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard, exact: true },
  { title: "Smart Email Generator", url: "/email", icon: Mail },
  { title: "Meeting Notes Summarizer", url: "/meetings", icon: FileText },
  { title: "AI Task Planner", url: "/tasks", icon: CalendarCheck },
  { title: "AI Research Assistant", url: "/research", icon: Search },
  { title: "AI Workplace Chatbot", url: "/chat", icon: MessageSquare },
];

const library = [
  { title: "Prompt Library", url: "/prompts", icon: BookMarked },
  { title: "AI History", url: "/history", icon: History },
  { title: "Saved Documents", url: "/documents", icon: Folder },
  { title: "Settings", url: "/settings", icon: Settings },
];

export function AppSidebar() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isActive = (url: string, exact?: boolean) =>
    exact ? pathname === url : pathname === url || pathname.startsWith(url + "/");

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b border-sidebar-border/60">
        <div className="flex items-center gap-2.5 px-2 py-2">
          <div
            className="grid h-9 w-9 shrink-0 place-items-center rounded-lg"
            style={{ background: "var(--gradient-primary)" }}
          >
            <Sparkles className="h-[18px] w-[18px] text-white" strokeWidth={2.5} />
          </div>
          <div className="flex min-w-0 flex-col group-data-[collapsible=icon]:hidden">
            <span className="truncate text-sm font-bold tracking-tight">Workspace AI</span>
            <span className="truncate text-[11px] text-sidebar-foreground/60">
              Productivity Suite
            </span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Workspace</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {workspace.map((item) => (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton asChild isActive={isActive(item.url, item.exact)} tooltip={item.title}>
                    <Link to={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Library</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {library.map((item) => (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton asChild isActive={isActive(item.url)} tooltip={item.title}>
                    <Link to={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border/60">
        <div className="rounded-lg bg-sidebar-accent/40 p-3 text-[11px] leading-relaxed text-sidebar-foreground/70 group-data-[collapsible=icon]:hidden">
          <p className="mb-1 font-semibold text-sidebar-foreground/90">Responsible AI</p>
          <p>
            AI output may contain inaccuracies. Verify important information before relying on it.
          </p>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}