import { useLocation, useNavigate, Link } from "react-router-dom";
import {
  Search,
  Bell,
  Command,
  Settings,
  User,
  LogOut,
} from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
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

const routeNames = {
  "/": "Dashboard",
  "/dashboard": "Dashboard",
  "/expenses": "Expenses",
  "/expenses/new": "New Expense",
  "/approvals": "Approval Queue",
  "/reimbursements": "Reimbursements",
  "/budgets": "Budgets",
  "/reports": "Reports & Analytics",
  "/admin/users": "User Management",
  "/admin/departments": "Departments",
  "/admin/projects": "Projects",
  "/admin/categories": "Expense Categories",
  "/admin/policies": "Policy Configuration",
  "/settings": "Settings",
};

export default function Topbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const currentTitle = routeNames[location.pathname] || "Dashboard";

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
        {/* Left side: Breadcrumb (and mobile trigger) */}
        <div className="flex items-center gap-3">
          <SidebarTrigger className="md:hidden size-9 flex items-center justify-center rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground [&_svg]:size-5" />
          <Breadcrumb className="flex items-center">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link to="/dashboard" className="text-sm font-normal text-muted-foreground hover:text-foreground">
                    Expense Management System
                  </Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage className="text-sm font-medium text-foreground">
                  {currentTitle}
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        {/* Right side: Search, Theme Toggle, Notification, Profile Dropdown */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Quick Search Input */}
          <div className="relative hidden md:block w-56 lg:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search expenses, claims..."
              className="h-9 pl-9 pr-12 text-xs rounded-full bg-muted/60 border-border/80 focus-visible:bg-background focus-visible:border-foreground/30 shadow-xs transition-all"
            />
            <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center gap-0.5 rounded-full border border-border bg-card px-2 py-0.5 text-[10px] text-muted-foreground shadow-xs">
              <Command size={10} />
              <span>K</span>
            </div>
          </div>

          {/* Dark / Light Mode Toggle */}
          <ModeToggle />

          {/* Notifications */}
          <Button variant="ghost" size="icon" className="size-9 relative flex items-center justify-center text-muted-foreground hover:text-foreground">
            <Bell className="size-4.5" />
            <span className="absolute top-1.5 right-1.5 size-2 rounded-full bg-destructive" />
            <span className="sr-only">Notifications</span>
          </Button>

          {/* Profile Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="relative size-9 flex items-center justify-center rounded-full p-0 hover:bg-transparent"
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
            <DropdownMenuContent align="end" className="w-60">
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