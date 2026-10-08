import React, { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import {
  Search,
  Bell,
  X,
  Settings,
  User,
  LogOut,
  FileText,
  PieChart,
  ShieldAlert,
  Layers,
  Activity,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Check,
  ChevronRight,
  ExternalLink,
  Trash2,
} from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import ModeToggle from "./ModeToggle";
import { useAuth } from "../../context/AuthContext";
import NotificationBellDropdown from "../notifications/NotificationBellDropdown";

const routeNames = {
  "/": "Dashboard",
  "/dashboard": "Dashboard",
  "/expenses": "Expenses",
  "/expenses/new": "New Expense",
  "/approvals": "Approval Queue",
  "/reimbursements": "Reimbursements",
  "/finance/reimbursements": "Reimbursements",
  "/budgets": "Budget Management",
  "/finance/budgets": "Budget Management",
  "/reports": "Financial Reports & Analytics",
  "/finance/reports": "Financial Reports",
  "/finance": "Finance Overview & Analytics",
  "/finance/analytics": "Financial Analytics",
  "/analytics": "Reports & Analytics",
  "/notifications": "Notification Center",
  "/admin/users": "User Management",
  "/admin/departments": "Departments",
  "/admin/projects": "Projects",
  "/admin/categories": "Expense Categories",
  "/admin/policies": "Policy Configuration",
  "/fraud-detection": "Fraud & Duplicate Detection",
  "/admin/fraud": "Fraud & Duplicate Detection",
  "/audit": "Audit Trail & Compliance",
  "/admin/audit": "Audit Trail & Compliance",
  "/integrations": "System Integrations",
  "/admin/integrations": "System Integrations",
  "/monitoring": "Application Monitoring",
  "/admin/monitoring": "Application Monitoring",
  "/settings": "Settings",
};

// Global searchable items across the application
const searchableItems = [
  // Users
  { id: "u-1", type: "User", title: "Arun Kumar", subtitle: "Admin • arun.kumar@company.com", path: "/admin/users", icon: User },
  { id: "u-2", type: "User", title: "Sarah Jenkins", subtitle: "VP Engineering • sarah.j@company.com", path: "/admin/users", icon: User },
  { id: "u-3", type: "User", title: "Mike Ross", subtitle: "Finance Lead • mike.r@company.com", path: "/admin/users", icon: User },
  { id: "u-4", type: "User", title: "Rachel Green", subtitle: "Marketing Director • rachel.g@company.com", path: "/admin/users", icon: User },
  { id: "u-5", type: "User", title: "Alex Morgan", subtitle: "DevOps Lead • alex.m@company.com", path: "/admin/users", icon: User },
  { id: "u-6", type: "User", title: "David Miller", subtitle: "Sales Executive • david.m@company.com", path: "/admin/users", icon: User },

  // Expenses & Claims
  { id: "e-1", type: "Expense", title: "EXP-2026-081", subtitle: "Delta Airlines • ₹53,400 • Flight to Tech Summit", path: "/expenses", icon: FileText },
  { id: "e-2", type: "Expense", title: "EXP-2026-082", subtitle: "Grand Hyatt Hotel • ₹18,750 • Client Lodging", path: "/expenses", icon: FileText },
  { id: "e-3", type: "Expense", title: "EXP-2026-083", subtitle: "Amazon Web Services • ₹1,24,000 • Cloud Hosting", path: "/expenses", icon: FileText },
  { id: "e-4", type: "Expense", title: "EXP-2026-084", subtitle: "The Capital Grille • ₹8,450 • Team Dinner", path: "/expenses", icon: FileText },
  { id: "e-5", type: "Expense", title: "EXP-2026-085", subtitle: "Dell Technologies • ₹32,000 • 4K Monitor", path: "/expenses", icon: FileText },

  // Budgets
  { id: "b-1", type: "Budget", title: "Engineering & Infrastructure", subtitle: "ENG-2026 • ₹1,00,000 Allocation", path: "/budgets", icon: PieChart },
  { id: "b-2", type: "Budget", title: "Marketing & Acquisition", subtitle: "MKT-2026 • ₹50,000 Allocation", path: "/budgets", icon: PieChart },
  { id: "b-3", type: "Budget", title: "Sales & Client Travel", subtitle: "SLS-2026 • ₹75,000 Allocation", path: "/budgets", icon: PieChart },

  // Pages & Core Modules
  { id: "p-1", type: "Page", title: "Dashboard", subtitle: "High-level analytics and KPIs overview", path: "/dashboard", icon: Layers },
  { id: "p-2", type: "Page", title: "All Expenses", subtitle: "Browse, filter and audit all employee claims", path: "/expenses", icon: FileText },
  { id: "p-3", type: "Page", title: "Create Expense", subtitle: "Submit new reimbursement claim with receipt", path: "/expenses/new", icon: FileText },
  { id: "p-4", type: "Page", title: "Approval Queue", subtitle: "Review and act on pending team expense claims", path: "/approvals", icon: CheckCircle2 },
  { id: "p-5", type: "Page", title: "Reimbursements", subtitle: "Batch payouts, settlement logs and bank disbursements", path: "/reimbursements", icon: Layers },
  { id: "p-6", type: "Page", title: "Department Budgets", subtitle: "Budget limits, spend thresholds and forecasts", path: "/budgets", icon: PieChart },
  { id: "p-7", type: "Page", title: "Audit Trail", subtitle: "Immutable ledger records, actor logs and history", path: "/audit", icon: FileText },
  { id: "p-8", type: "Page", title: "Fraud & Duplicate Detection", subtitle: "AI risk analysis, anomaly flags and duplicates", path: "/fraud-detection", icon: ShieldAlert },
  { id: "p-9", type: "Page", title: "System Integrations", subtitle: "Corporate cards (Amex/Chase), ERP and Webhooks", path: "/integrations", icon: RefreshCw },
  { id: "p-10", type: "Page", title: "Application Monitoring", subtitle: "Server uptime, database health and API latency telemetry", path: "/monitoring", icon: Activity },
  { id: "p-11", type: "Page", title: "User Management", subtitle: "Manage user roles, departments and accounts", path: "/admin/users", icon: User },
  { id: "p-12", type: "Page", title: "Policy Configuration", subtitle: "Expense limits, category limits and compliance rules", path: "/admin/policies", icon: ShieldAlert },
  { id: "p-13", type: "Page", title: "Settings", subtitle: "Preferences, currency formats and security", path: "/settings", icon: Settings },
];

export default function Topbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const currentTitle = routeNames[location.pathname] || "Dashboard";

  // Search State
  const [searchQuery, setSearchQuery] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);
  const searchContainerRef = useRef(null);

  // Notifications State
  const [notifications, setNotifications] = useState([
    {
      id: "notif-1",
      title: "Expense Claim Approved",
      description: "EXP-2026-081 (₹53,400 - Delta Airlines) approved by Sarah Jenkins.",
      time: "8 mins ago",
      unread: true,
      path: "/expenses",
      icon: CheckCircle2,
      color: "text-emerald-500 bg-emerald-500/10",
    },
    {
      id: "notif-2",
      title: "Budget Threshold Warning",
      description: "Engineering & Infrastructure budget reached 82.5% of quarterly allocation.",
      time: "35 mins ago",
      unread: true,
      path: "/budgets",
      icon: AlertTriangle,
      color: "text-amber-500 bg-amber-500/10",
    },
    {
      id: "notif-3",
      title: "Duplicate Receipt Flagged",
      description: "Fraud engine detected matching receipt timestamp on claim EXP-2026-084.",
      time: "1 hour ago",
      unread: true,
      path: "/fraud-detection",
      icon: ShieldAlert,
      color: "text-rose-500 bg-rose-500/10",
    },
    {
      id: "notif-4",
      title: "Card Feed Sync Completed",
      description: "American Express corporate banking synced 38 new card charges.",
      time: "2 hours ago",
      unread: false,
      path: "/integrations",
      icon: RefreshCw,
      color: "text-blue-500 bg-blue-500/10",
    },
    {
      id: "notif-5",
      title: "Compliance Policy Updated",
      description: "Policy POL-01 (Mandatory Receipt Requirement) was modified by Admin.",
      time: "4 hours ago",
      unread: false,
      path: "/audit",
      icon: FileText,
      color: "text-purple-500 bg-purple-500/10",
    },
  ]);

  const unreadCount = notifications.filter((n) => n.unread).length;

  // Filter search results
  const searchResults = searchQuery.trim()
    ? searchableItems.filter((item) => {
        const query = searchQuery.toLowerCase().trim();
        return (
          item.title.toLowerCase().includes(query) ||
          item.subtitle.toLowerCase().includes(query) ||
          item.type.toLowerCase().includes(query)
        );
      })
    : [];

  // Close search when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target)) {
        setSearchFocused(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelectResult = (path) => {
    navigate(path);
    setSearchQuery("");
    setSearchFocused(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && searchResults.length > 0) {
      handleSelectResult(searchResults[0].path);
    } else if (e.key === "Escape") {
      setSearchFocused(false);
    }
  };

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  };

  const handleClearNotifications = () => {
    setNotifications([]);
  };

  const handleNotificationClick = (notif) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === notif.id ? { ...n, unread: false } : n))
    );
    navigate(notif.path);
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const userInitials = (user?.name || "Tharun")
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <header className="sticky top-0 z-50 h-16 w-full border-b border-border/80 bg-card flex items-center shadow-xs">
      <div className="flex size-full items-center justify-between px-4 sm:px-6">
        {/* Left side: Mobile trigger and Clean Section Title */}
        <div className="flex items-center gap-3">
          <SidebarTrigger className="lg:hidden size-9 flex items-center justify-center rounded-lg bg-black text-white hover:bg-zinc-800 border border-black dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-100 dark:border-white shadow-xs [&_svg]:size-4.5" />
          <h1 className="text-sm sm:text-base font-semibold text-foreground tracking-tight truncate">
            {currentTitle}
          </h1>
        </div>

        {/* Right side: Search, Theme Toggle, Notification, Profile Dropdown */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Quick Search Input with Live Results Popover */}
          <div ref={searchContainerRef} className="relative hidden md:block w-64 lg:w-80">
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
              <Input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setSearchFocused(true);
                }}
                onFocus={() => setSearchFocused(true)}
                onKeyDown={handleKeyDown}
                placeholder="Search expenses, claims, users..."
                className="h-9 pl-9 pr-8 text-xs rounded-full bg-muted/60 border-border/80 focus-visible:bg-background focus-visible:border-foreground/30 shadow-xs transition-all font-medium"
              />
              {/* Clear button (with blue/accent X matching reference image) */}
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery("");
                    setSearchFocused(false);
                  }}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 size-4.5 flex items-center justify-center rounded-full text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 transition-colors cursor-pointer"
                  title="Clear search"
                >
                  <X className="size-3.5 stroke-[2.5]" />
                </button>
              )}
            </div>

            {/* Live Search Results Dropdown */}
            {searchFocused && searchQuery.trim().length > 0 && (
              <div className="absolute top-11 left-0 w-full sm:w-96 rounded-2xl border border-border bg-popover text-popover-foreground shadow-2xl p-2 z-50 animate-in fade-in-80 zoom-in-95 max-h-96 overflow-y-auto">
                <div className="px-3 py-1.5 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider flex items-center justify-between border-b border-border/50 mb-1">
                  <span>Results for "{searchQuery}"</span>
                  <span className="text-[10px] font-normal">{searchResults.length} matches</span>
                </div>

                {searchResults.length === 0 ? (
                  <div className="py-8 text-center text-xs text-muted-foreground">
                    No results found for <span className="font-semibold text-foreground">"{searchQuery}"</span>.
                    <p className="text-[11px] mt-1 text-muted-foreground/80">Try searching for "Arun", "Delta", "EXP-2026-081", or "Budgets".</p>
                  </div>
                ) : (
                  <div className="space-y-1">
                    {searchResults.map((item) => {
                      const IconComp = item.icon;
                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => handleSelectResult(item.path)}
                          className="w-full flex items-center justify-between p-2 rounded-xl text-left hover:bg-muted/80 transition-colors cursor-pointer group"
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <div className="size-8 rounded-lg bg-muted flex items-center justify-center shrink-0 group-hover:bg-background border border-border/50">
                              <IconComp className="size-4 text-foreground/80" />
                            </div>
                            <div className="min-w-0 truncate">
                              <div className="flex items-center gap-1.5">
                                <span className="text-xs font-semibold text-foreground truncate">{item.title}</span>
                                <Badge variant="secondary" className="text-[10px] py-0 px-1.5 h-4.5 font-normal">
                                  {item.type}
                                </Badge>
                              </div>
                              <p className="text-[11px] text-muted-foreground truncate">{item.subtitle}</p>
                            </div>
                          </div>
                          <ChevronRight className="size-3.5 text-muted-foreground opacity-40 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all shrink-0 ml-2" />
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Dark / Light Mode Toggle */}
          <ModeToggle />

          {/* Live Notification Center Bell */}
          <NotificationBellDropdown />

          {/* Profile Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="relative size-9 flex items-center justify-center rounded-full p-0 hover:bg-transparent cursor-pointer"
              >
                <Avatar className="size-8.5">
                  <AvatarImage src={user?.avatar} alt={user?.name || "User"} />
                  <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
                    {userInitials}
                  </AvatarFallback>
                </Avatar>
                <span className="ring-card absolute right-0 bottom-0 block size-2.5 rounded-full bg-emerald-600 ring-2" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-60 rounded-xl shadow-xl">
              <DropdownMenuGroup>
                <DropdownMenuLabel className="flex items-center gap-3 px-2 py-2.5 font-normal">
                  <div className="relative">
                    <Avatar className="size-10">
                      <AvatarImage src={user?.avatar} alt={user?.name || "User"} />
                      <AvatarFallback className="bg-primary/10 text-primary font-semibold text-xs">
                        {userInitials}
                      </AvatarFallback>
                    </Avatar>
                    <span className="ring-card absolute right-0 bottom-0 block size-2.5 rounded-full bg-emerald-600 ring-2" />
                  </div>
                  <div className="flex flex-1 flex-col items-start leading-tight">
                    <span className="text-foreground text-sm font-semibold">{user?.name || "Tharun"}</span>
                    <span className="text-muted-foreground text-xs mt-0.5">{user?.email || "tharun@company.com"}</span>
                    <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                      <Badge variant="outline" className="text-[10px] py-0 px-1.5 font-semibold border-primary/30 text-primary bg-primary/5">
                        {user?.role || "Employee"}
                      </Badge>
                      <Badge variant="secondary" className="text-[10px] py-0 px-1.5 font-normal text-muted-foreground">
                        {user?.department || "Engineering & DevOps"}
                      </Badge>
                    </div>
                  </div>
                </DropdownMenuLabel>
              </DropdownMenuGroup>

              <DropdownMenuSeparator />

              <DropdownMenuGroup>
                <DropdownMenuItem asChild className="cursor-pointer">
                  <Link to="/settings" className="flex items-center gap-2">
                    <User className="size-4" />
                    <span>My Account</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="cursor-pointer">
                  <Link to="/settings" className="flex items-center gap-2">
                    <Settings className="size-4" />
                    <span>Settings</span>
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuGroup>

              <DropdownMenuSeparator />

              <DropdownMenuGroup>
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="text-destructive focus:bg-destructive/10 focus:text-destructive cursor-pointer flex items-center gap-2"
                >
                  <LogOut className="size-4" />
                  <span>Sign out</span>
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}

export { Topbar as Header };