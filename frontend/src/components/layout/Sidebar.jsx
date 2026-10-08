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
  ShieldAlert,
  History,
  Puzzle,
  Activity,
  Settings,
  ChevronRight,
  PanelLeftClose,
  PanelLeftOpen,
  Bell,
  Landmark,
  FileText,
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

import { useAuth } from "../../context/AuthContext";

const checkSubActive = (subHref, currentPath) => {
  if (currentPath === subHref) return true;
  if (subHref === "/admin/projects" && (currentPath === "/projects" || currentPath.startsWith("/projects/"))) return true;
  if (subHref === "/admin/categories" && (currentPath === "/categories" || currentPath.startsWith("/categories/"))) return true;
  if (subHref === "/admin/policies" && (currentPath === "/policies" || currentPath.startsWith("/policies/"))) return true;
  if (subHref === "/admin/users" && (currentPath === "/users" || currentPath.startsWith("/users/"))) return true;
  if (subHref === "/admin/departments" && (currentPath === "/departments" || currentPath.startsWith("/departments/"))) return true;
  return currentPath.startsWith(subHref + "/");
};

function CollapsibleNavItem({ item, location }) {
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";
  const isAnyChildActive = item.childItems?.some(
    (sub) => checkSubActive(sub.href, location.pathname)
  );
  const [isOpen, setIsOpen] = React.useState(true);
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
                "size-9! p-0! justify-center! mx-auto! rounded-xl cursor-pointer transition-colors",
                isAnyChildActive
                  ? "bg-zinc-200! text-zinc-950! shadow-xs border border-zinc-300/70 hover:bg-zinc-200! hover:text-zinc-950! dark:bg-zinc-800! dark:text-white! dark:border dark:border-zinc-700/60 font-semibold"
                  : "bg-transparent text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100/80 dark:text-zinc-400 dark:hover:text-white dark:hover:bg-zinc-800/60"
              )}
            >
              <Icon className={cn("size-4.5 shrink-0", isAnyChildActive ? "text-zinc-950 dark:text-white" : "text-zinc-600 dark:text-zinc-400")} />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            side="right"
            align="start"
            sideOffset={12}
            className="w-52 p-1.5 shadow-xl rounded-xl border border-zinc-200 bg-white text-zinc-900 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100 animate-in fade-in zoom-in-95 duration-150 z-50"
          >
            <div className="px-2.5 py-1.5 text-[11px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
              {item.label}
            </div>
            <div className="space-y-0.5">
              {item.childItems.map((subItem) => {
                const isSubActive = checkSubActive(subItem.href, location.pathname);
                return (
                  <DropdownMenuItem key={subItem.label} asChild className="cursor-pointer rounded-lg p-0">
                    <NavLink
                      to={subItem.href}
                      className={cn(
                        "flex items-center w-full px-2.5 py-1.5 text-xs rounded-lg transition-colors font-medium",
                        isSubActive
                          ? "bg-zinc-200 text-zinc-950 font-bold border border-zinc-300/60 dark:bg-zinc-800 dark:text-white"
                          : "text-zinc-700 hover:bg-zinc-100 hover:text-zinc-950 dark:text-zinc-300 dark:hover:bg-zinc-800/60 dark:hover:text-white"
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

  // When sidebar is extended: inline accordion matching reference Image 2
  return (
    <SidebarMenuItem className="w-full">
      {isOpen ? (
        <div className="flex items-start gap-2.5 w-full px-2 py-1">
          {/* Logo button on the left */}
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            title={`Toggle ${item.label}`}
            className={cn(
              "size-9 rounded-xl p-0 flex items-center justify-center shrink-0 transition-colors cursor-pointer",
              isAnyChildActive
                ? "bg-zinc-200 text-zinc-950 shadow-xs border border-zinc-300/70 dark:bg-zinc-800 dark:text-white dark:border dark:border-zinc-700/60"
                : "bg-transparent text-zinc-700 hover:text-zinc-950 hover:bg-zinc-100/80 dark:bg-transparent dark:text-zinc-300 dark:hover:text-white dark:hover:bg-zinc-800/60"
            )}
          >
            <Icon className={cn("size-4.5", isAnyChildActive ? "text-zinc-950 dark:text-white" : "text-zinc-700 dark:text-zinc-300")} />
          </button>

          {/* Subitems list with vertical divider line */}
          <div className="border-l border-zinc-200 dark:border-zinc-800 pl-3 flex flex-col gap-1.5 flex-1 min-w-0">
            {item.childItems.map((subItem) => {
              const isSubActive = checkSubActive(subItem.href, location.pathname);
              return (
                <NavLink
                  key={subItem.label}
                  to={subItem.href}
                  className={cn(
                    "block py-1 text-xs transition-colors truncate rounded-md px-2",
                    isSubActive
                      ? "bg-zinc-200 text-zinc-950 font-semibold shadow-2xs border border-zinc-300/50 dark:bg-zinc-800 dark:text-white"
                      : "text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100/80 font-normal dark:text-zinc-400 dark:hover:text-zinc-200 dark:hover:bg-zinc-800/40"
                  )}
                >
                  {subItem.label}
                </NavLink>
              );
            })}
          </div>
        </div>
      ) : (
        /* Closed state: Full pill button matching reference Image 1 */
        <SidebarMenuButton
          tooltip={item.label}
          isActive={isAnyChildActive}
          onClick={() => setIsOpen(true)}
          className={cn(
            "w-full justify-between font-medium cursor-pointer h-10 rounded-xl px-3 transition-colors",
            isAnyChildActive
              ? "bg-zinc-200! text-zinc-950! font-semibold shadow-xs border border-zinc-300/70 dark:bg-zinc-800! dark:text-white!"
              : "text-zinc-800 hover:text-zinc-950 hover:bg-zinc-100/80 dark:text-zinc-300 dark:hover:text-white dark:hover:bg-zinc-800/60"
          )}
        >
          <div className="flex items-center gap-2">
            <Icon className={cn("size-4.5 shrink-0", isAnyChildActive ? "text-zinc-950 dark:text-white" : "text-zinc-700 dark:text-zinc-300")} />
            <span className={isAnyChildActive ? "text-zinc-950 dark:text-white font-semibold" : ""}>{item.label}</span>
          </div>
          <ChevronRight className={cn(
            "ml-auto size-4",
            isAnyChildActive ? "text-zinc-950 dark:text-white" : "text-zinc-500 dark:text-zinc-400"
          )} />
        </SidebarMenuButton>
      )}
    </SidebarMenuItem>
  );
}

const NAV_GROUPS = [
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
        icon: FileText,
      },
      {
        label: "Receipts",
        href: "/receipts",
        icon: Receipt,
      },
      {
        label: "Approvals",
        href: "/approvals",
        icon: CheckSquare,
        badge: "3",
      },
      {
        label: "Fraud & Detection",
        href: "/fraud-detection",
        icon: ShieldAlert,
        badge: "4",
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
      {
        label: "Audit Trail",
        href: "/audit",
        icon: History,
      },
      {
        label: "Integrations",
        href: "/integrations",
        icon: Puzzle,
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
        label: "Monitoring",
        href: "/monitoring",
        icon: Activity,
        badge: "Live",
      },
      {
        label: "Settings",
        href: "/settings",
        icon: Settings,
      },
    ],
  },
];

export function AppSidebar({ ...props }) {
  const location = useLocation();
  const { open, toggleSidebar } = useSidebar();
  const { user } = useAuth();

  const roleName = user?.role || "Employee";
  const roleLower = roleName.toLowerCase();

  const isAdmin = roleLower === "admin";
  const isCFO =
    roleLower.includes("cfo") ||
    roleLower.includes("finance manager") ||
    roleLower.includes("head of finance");
  const isFinanceExec =
    roleLower.includes("finance exec") ||
    roleLower === "finance admin" ||
    roleLower === "finance";
  const isFinanceTeam = isFinanceExec || isCFO || isAdmin;
  const isManager = roleLower.includes("manager") || isCFO || isAdmin;
  const isEmployee = !isManager && !isFinanceTeam && !isAdmin;

  const filteredNavGroups = React.useMemo(() => {
    return NAV_GROUPS
      .map((group) => {
        const filteredItems = group.items
          .map((item) => {
            if (item.childItems) {
              const filteredChildren = item.childItems.filter((sub) => {
                if (sub.href === "/admin/users" || sub.href === "/admin/departments") return isAdmin;
                if (sub.href === "/admin/projects") return isAdmin || isManager;
                if (sub.href === "/admin/categories" || sub.href === "/admin/policies") return isCFO || isAdmin;
                return true;
              });
              if (filteredChildren.length === 0) return null;
              return { ...item, childItems: filteredChildren };
            }

            if (item.href === "/finance") return isFinanceTeam ? item : null;
            if (item.href === "/approvals") return (isManager || isFinanceTeam) ? item : null;
            if (item.href === "/fraud-detection") return (isCFO || isAdmin) ? item : null;
            if (item.href === "/budgets") return (isManager || isFinanceTeam) ? item : null;
            if (item.href === "/reports") return (isManager || isFinanceTeam) ? item : null;
            if (item.href === "/audit") return isFinanceTeam ? item : null;
            if (item.href === "/integrations") return isAdmin ? item : null;
            if (item.href === "/monitoring") return (isCFO || isAdmin) ? item : null;

            return item;
          })
          .filter(Boolean);

        return {
          ...group,
          items: filteredItems,
        };
      })
      .filter((group) => group.items.length > 0);
  }, [isAdmin, isCFO, isFinanceTeam, isManager]);

  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border bg-sidebar" {...props}>
      {/* 1. Header: Toggle button matching Image 1 (black in light) & Image 2 (white in dark) */}
      <SidebarHeader className="p-3 pb-1 group-data-[collapsible=icon]:p-0 group-data-[collapsible=icon]:py-2.5 group-data-[collapsible=icon]:h-14 border-none flex flex-row items-center justify-start group-data-[collapsible=icon]:justify-center overflow-hidden">
        <div className="flex items-center justify-start group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:w-full shrink-0">
          <button
            type="button"
            onClick={toggleSidebar}
            title={open ? "Collapse sidebar" : "Expand sidebar"}
            className="size-9 rounded-xl bg-transparent text-zinc-700 hover:text-zinc-950 hover:bg-zinc-100/80 border border-transparent hover:border-zinc-200 dark:bg-transparent dark:text-zinc-300 dark:hover:text-white dark:hover:bg-zinc-800/60 dark:hover:border-zinc-700 shadow-none flex items-center justify-center transition-colors cursor-pointer group-data-[collapsible=icon]:mx-auto"
          >
            {open ? (
              <PanelLeftClose className="size-4.5 stroke-[2]" />
            ) : (
              <PanelLeftOpen className="size-4.5 stroke-[2]" />
            )}
          </button>
        </div>
      </SidebarHeader>

      {/* 2. Menu Navigation without group title words */}
      <SidebarContent className="px-2 py-1 group-data-[collapsible=icon]:px-0 group-data-[collapsible=icon]:py-2 pb-20">
        {filteredNavGroups.map((group, groupIdx) => (
          <SidebarGroup key={group.groupLabel || groupIdx} className="py-0.5 group-data-[collapsible=icon]:p-0 group-data-[collapsible=icon]:my-0.5">
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

                  const checkIsActive = (href, currentPath) => {
                    if (href === "/dashboard") return currentPath === "/" || currentPath === "/dashboard";
                    if (href === "/finance") return currentPath === "/finance" || currentPath === "/finance/analytics";
                    if (href === "/budgets") return currentPath === "/budgets" || currentPath === "/finance/budgets" || currentPath.startsWith("/budgets/") || currentPath.startsWith("/finance/budgets/");
                    if (href === "/reports") return currentPath === "/reports" || currentPath === "/finance/reports" || currentPath === "/analytics" || currentPath.startsWith("/reports/") || currentPath.startsWith("/finance/reports/");
                    if (href === "/reimbursements") return currentPath === "/reimbursements" || currentPath === "/finance/reimbursements" || currentPath.startsWith("/reimbursements/") || currentPath.startsWith("/finance/reimbursements/");
                    if (href === "/fraud-detection") return currentPath === "/fraud-detection" || currentPath.startsWith("/admin/fraud") || currentPath.startsWith("/fraud-detection/");
                    if (href === "/audit") return currentPath === "/audit" || currentPath.startsWith("/admin/audit") || currentPath.startsWith("/audit/");
                    if (href === "/integrations") return currentPath === "/integrations" || currentPath.startsWith("/admin/integrations") || currentPath.startsWith("/integrations/");
                    if (href === "/monitoring") return currentPath === "/monitoring" || currentPath.startsWith("/admin/monitoring") || currentPath.startsWith("/monitoring/");
                    if (href === "/expenses") return currentPath === "/expenses" || currentPath.startsWith("/expenses/");
                    if (href === "/receipts") return currentPath === "/receipts" || currentPath.startsWith("/receipts/");
                    if (href === "/approvals") return currentPath === "/approvals" || currentPath.startsWith("/approvals/");
                    if (href === "/notifications") return currentPath === "/notifications" || currentPath.startsWith("/notifications/");
                    if (href === "/settings") return currentPath === "/settings" || currentPath.startsWith("/settings/");
                    return currentPath === href || currentPath.startsWith(href + "/");
                  };

                  const isActive = checkIsActive(item.href, location.pathname);

                  return (
                    <SidebarMenuItem key={item.label} className="w-full">
                      <SidebarMenuButton
                        asChild
                        tooltip={item.label}
                        isActive={isActive}
                        className={cn(
                          "h-10 rounded-xl px-3 transition-colors cursor-pointer",
                          "group-data-[collapsible=icon]:size-9! group-data-[collapsible=icon]:p-0! group-data-[collapsible=icon]:justify-center! group-data-[collapsible=icon]:mx-auto!",
                          isActive
                            ? "bg-zinc-200! text-zinc-950! font-semibold shadow-xs border border-zinc-300/70 hover:bg-zinc-200! hover:text-zinc-950! group-data-[collapsible=icon]:bg-zinc-200! group-data-[collapsible=icon]:text-zinc-950! group-data-[collapsible=icon]:shadow-xs group-data-[collapsible=icon]:border group-data-[collapsible=icon]:border-zinc-300/70 dark:bg-zinc-800! dark:text-white! dark:hover:bg-zinc-800! dark:hover:text-white! dark:border dark:border-zinc-700/60 dark:group-data-[collapsible=icon]:bg-zinc-800! dark:group-data-[collapsible=icon]:text-white!"
                            : "text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100/80 bg-transparent dark:text-zinc-400 dark:hover:text-white dark:hover:bg-zinc-800/40 dark:bg-transparent group-data-[collapsible=icon]:bg-transparent"
                        )}
                      >
                        <NavLink to={item.href} className="flex items-center justify-start group-data-[collapsible=icon]:justify-center size-full">
                          <Icon className={cn("size-4.5 shrink-0", isActive ? "text-zinc-950 dark:text-white" : "text-zinc-600 dark:text-zinc-400")} />
                          <span className="flex-1 truncate group-data-[collapsible=icon]:hidden">{item.label}</span>
                          {item.badge && (
                            <span className={cn(
                              "size-5 rounded-full text-[11px] font-semibold flex items-center justify-center ml-auto group-data-[collapsible=icon]:hidden",
                              isActive
                                ? "bg-zinc-300 text-zinc-900 dark:bg-zinc-700 dark:text-zinc-200"
                                : "bg-zinc-200 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
                            )}>
                              {item.badge}
                            </span>
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