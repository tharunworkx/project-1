import * as React from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Receipt,
  CheckSquare,
  CreditCard,
  PieChart,
  BarChart3,
  Building2,
  ShieldCheck,
  Settings,
  ChevronRight,
  PanelLeftClose,
  PanelLeftOpen,
  Bell,
  Landmark,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "cn";

function CollapsibleNavItem({ item, location }) {
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";
  const isAnyChildActive = item.childItems?.some(
    (sub) => location.pathname === sub.href
  );
  const [isOpen, setIsOpen] = React.useState(isAnyChildActive);
  const Icon = item.icon;

  React.useEffect(() => {
    if (isAnyChildActive) {
      setIsOpen(true);
    }
  }, [isAnyChildActive]);

  // If sidebar is minimized into icon rail, show an instant flyout dropdown menu on click/hover
  if (isCollapsed) {
    return (
      <SidebarMenuItem className="w-full flex justify-center">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              tooltip={item.label}
              isActive={isAnyChildActive}
              className={cn(
                "size-9! p-0! justify-center! mx-auto! rounded-lg cursor-pointer transition-colors",
                isAnyChildActive ? "bg-primary/10 text-primary font-semibold" : "hover:bg-sidebar-accent"
              )}
            >
              <Icon className="size-4.5 shrink-0" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            side="right"
            align="start"
            sideOffset={12}
            className="w-52 p-1.5 shadow-xl rounded-xl border border-border bg-popover text-popover-foreground animate-in fade-in zoom-in-95 duration-150 z-50"
          >
            <div className="px-2.5 py-1.5 text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
              {item.label}
            </div>
            <div className="space-y-0.5">
              {item.childItems.map((subItem) => {
                const isSubActive = location.pathname === subItem.href;
                return (
                  <DropdownMenuItem key={subItem.label} asChild className="cursor-pointer rounded-lg p-0">
                    <NavLink
                      to={subItem.href}
                      className={cn(
                        "flex items-center w-full px-2.5 py-1.5 text-xs rounded-lg transition-colors font-medium",
                        isSubActive
                          ? "bg-primary/10 text-primary font-bold"
                          : "text-foreground hover:bg-muted"
                      )}
                    >
                      {subItem.label}
                    </NavLink>
                  </DropdownMenuItem>
                );
              })}
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    );
  }

  // When sidebar is extended: inline accordion showing only logo on left when open
  return (
    <SidebarMenuItem className="w-full">
      {isOpen ? (
        <div className="flex items-start gap-2.5 w-full">
          {/* Logo button on the left */}
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            title={`Collapse ${item.label}`}
            className="size-9 rounded-lg p-0 flex items-center justify-center shrink-0 bg-sidebar-accent/80 text-sidebar-foreground hover:bg-sidebar-accent transition-colors cursor-pointer"
          >
            <Icon className="size-4.5" />
          </button>

          {/* Subitems list with vertical divider line */}
          <div className="border-l border-sidebar-border pl-2 flex flex-col gap-1 flex-1 min-w-0">
            {item.childItems.map((subItem) => {
              const isSubActive = location.pathname === subItem.href;
              return (
                <NavLink
                  key={subItem.label}
                  to={subItem.href}
                  className={cn(
                    "block px-3 py-1.5 rounded-lg text-xs transition-colors",
                    isSubActive
                      ? "bg-muted font-bold text-foreground shadow-xs"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50 font-medium"
                  )}
                >
                  {subItem.label}
                </NavLink>
              );
            })}
          </div>
        </div>
      ) : (
        /* Closed state: Full pill button matching reference */
        <SidebarMenuButton
          tooltip={item.label}
          isActive={isAnyChildActive}
          onClick={() => setIsOpen(true)}
          className="w-full justify-between font-medium cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <Icon className="size-4.5 shrink-0" />
            <span>{item.label}</span>
          </div>
          <ChevronRight className="ml-auto size-4 text-muted-foreground" />
        </SidebarMenuButton>
      )}
    </SidebarMenuItem>
  );
}

export function AppSidebar({ ...props }) {
  const location = useLocation();
  const { open, toggleSidebar } = useSidebar();

  const navGroups = [
    {
      groupLabel: "DASHBOARD & OVERVIEW",
      items: [
        {
          label: "Dashboard",
          href: "/dashboard",
          icon: LayoutDashboard,
        },
        {
          label: "Finance Analytics",
          href: "/finance",
          icon: Landmark,
        },
      ],
    },
    {
      groupLabel: "FINANCE & EXPENSES",
      items: [
        {
          label: "Expenses",
          href: "/expenses",
          icon: Receipt,
        },
        {
          label: "Approvals",
          href: "/approvals",
          icon: CheckSquare,
          badge: "3",
        },
        {
          label: "Reimbursements",
          href: "/reimbursements",
          icon: CreditCard,
        },
        {
          label: "Budgets",
          href: "/budgets",
          icon: PieChart,
        },
        {
          label: "Financial Reports",
          href: "/reports",
          icon: BarChart3,
        },
      ],
    },
    {
      groupLabel: "ADMINISTRATION",
      items: [
        {
          label: "Organization",
          icon: Building2,
          childItems: [
            { label: "Users & Teams", href: "/admin/users" },
            { label: "Departments", href: "/admin/departments" },
            { label: "Projects", href: "/admin/projects" },
          ],
        },
        {
          label: "Policies & Categories",
          icon: ShieldCheck,
          childItems: [
            { label: "Expense Categories", href: "/admin/categories" },
            { label: "Approval Policies", href: "/admin/policies" },
          ],
        },
      ],
    },
    {
      groupLabel: "SETTINGS & SYSTEM",
      items: [
        {
          label: "Notification Center",
          href: "/notifications",
          icon: Bell,
        },
        {
          label: "Settings",
          href: "/settings",
          icon: Settings,
        },
      ],
    },
  ];

  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border bg-sidebar" {...props}>
      {/* 1. Header: Fixed-origin minimize button anchored to side with white background & dynamic action icon */}
      <SidebarHeader className="h-16 border-b border-sidebar-border p-0 flex flex-row items-center justify-start overflow-hidden">
        <div className="w-12 h-16 flex items-center justify-center shrink-0">
          <button
            type="button"
            onClick={toggleSidebar}
            title={open ? "Collapse sidebar" : "Expand sidebar"}
            className="size-9 rounded-lg bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 border border-zinc-200/90 dark:border-zinc-700 shadow-xs hover:bg-zinc-50 dark:hover:bg-zinc-700 flex items-center justify-center transition-colors cursor-pointer"
          >
            {open ? (
              <PanelLeftClose className="size-4.5" />
            ) : (
              <PanelLeftOpen className="size-4.5" />
            )}
          </button>
        </div>
      </SidebarHeader>

      {/* 2. Menu Navigation with Groups and Collapsible Nav Items */}
      <SidebarContent className="px-2 py-2 group-data-[collapsible=icon]:px-0 group-data-[collapsible=icon]:py-2">
        {navGroups.map((group) => (
          <SidebarGroup key={group.groupLabel} className="py-1.5 group-data-[collapsible=icon]:p-0 group-data-[collapsible=icon]:my-0.5">
            <SidebarGroupLabel className="text-sidebar-foreground/50 tracking-wider uppercase text-[10px] font-semibold px-2 mb-1 group-data-[collapsible=icon]:hidden">
              {group.groupLabel}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => {
                  const Icon = item.icon;

                  if (item.childItems) {
                    return (
                      <CollapsibleNavItem
                        key={item.label}
                        item={item}
                        location={location}
                      />
                    );
                  }

                  const isActive =
                    location.pathname === item.href ||
                    (item.href === "/dashboard" && location.pathname === "/");

                  return (
                    <SidebarMenuItem key={item.label} className="w-full">
                      <SidebarMenuButton
                        asChild
                        tooltip={item.label}
                        isActive={isActive}
                        className={cn(
                          isActive ? "bg-primary/10 text-primary font-semibold" : "hover:bg-sidebar-accent",
                          "group-data-[collapsible=icon]:size-9! group-data-[collapsible=icon]:p-0! group-data-[collapsible=icon]:justify-center! group-data-[collapsible=icon]:mx-auto!"
                        )}
                      >
                        <NavLink to={item.href} className="flex items-center justify-start group-data-[collapsible=icon]:justify-center size-full">
                          <Icon className="size-4.5 shrink-0" />
                          <span className="flex-1 truncate group-data-[collapsible=icon]:hidden">{item.label}</span>
                          {item.badge && (
                            <SidebarMenuBadge className="bg-primary/10 text-primary rounded-full px-1.5 text-xs font-semibold ml-auto group-data-[collapsible=icon]:hidden">
                              {item.badge}
                            </SidebarMenuBadge>
                          )}
                        </NavLink>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      {/* 3. Rail for click-drag/toggle */}
      <SidebarRail />
    </Sidebar>
  );
}

export { AppSidebar as Sidebar };
export default AppSidebar;