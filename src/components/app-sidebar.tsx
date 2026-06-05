import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutGrid,
  Mail,
  FileText,
  ListTodo,
  Search,
  MessageSquare,
  Settings,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { BrandMark } from "./brand-mark";
import { cn } from "@/lib/utils";

const items = [
  { title: "Dashboard", url: "/", icon: LayoutGrid, active: "bg-slate-900 text-white hover:bg-slate-900 hover:text-white" },
  { title: "Smart Email", url: "/email", icon: Mail, active: "bg-cyan-100 text-cyan-900 hover:bg-cyan-100 hover:text-cyan-900" },
  { title: "Meeting Notes", url: "/notes", icon: FileText, active: "bg-purple-100 text-purple-900 hover:bg-purple-100 hover:text-purple-900" },
  { title: "Task Planner", url: "/planner", icon: ListTodo, active: "bg-green-100 text-green-900 hover:bg-green-100 hover:text-green-900" },
  { title: "Research", url: "/research", icon: Search, active: "bg-rose-100 text-rose-900 hover:bg-rose-100 hover:text-rose-900" },
  { title: "Assistant Chat", url: "/chat", icon: MessageSquare, active: "bg-orange-100 text-orange-900 hover:bg-orange-100 hover:text-orange-900" },
];

export function AppSidebar() {
  const pathname = useRouterState({ select: (r) => r.location.pathname });

  return (
    <Sidebar collapsible="icon" className="border-r border-slate-200 bg-white [&>div]:bg-white">
      <SidebarHeader className="bg-white px-3 py-4">
        <Link to="/" className="flex items-center gap-2.5">
          <BrandMark className="h-8 w-8 shrink-0" />
          <div className="flex flex-col leading-tight group-data-[collapsible=icon]:hidden">
            <span className="text-sm font-semibold tracking-tight text-slate-900">ONE</span>
            <span className="text-[11px] text-slate-500">
              Workplace AI Assistant
            </span>
          </div>
        </Link>
      </SidebarHeader>
      <SidebarContent className="bg-white">
        <SidebarGroup>
          <SidebarGroupLabel className="text-slate-500">Workspace</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => {
                const isActive =
                  item.url === "/"
                    ? pathname === "/"
                    : pathname === item.url || pathname.startsWith(item.url + "/");
                return (
                  <SidebarMenuItem key={item.url}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      tooltip={item.title}
                      className={cn(
                        "rounded-xl text-slate-600 hover:bg-slate-100 hover:text-slate-900 data-[active=true]:font-semibold",
                        isActive && item.active,
                      )}
                    >
                      <Link to={item.url} className="flex items-center gap-2">
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
