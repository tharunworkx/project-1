import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "./Sidebar";
import Topbar from "./Topbar";
import Footer from "./Footer";
import { Outlet } from "react-router-dom";

export default function MainLayout({ children }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="flex flex-1 flex-col min-h-screen min-w-0 max-w-full bg-background overflow-x-clip">
        <Topbar />
        <main className="mx-auto w-full max-w-360 flex-1 px-4 py-6 sm:px-6 space-y-6 min-w-0">
          {children || <Outlet />}
        </main>
        <Footer />
      </SidebarInset>
    </SidebarProvider>
  );
}