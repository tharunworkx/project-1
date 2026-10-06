import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "./Sidebar";
import Topbar from "./Topbar";
import Footer from "./Footer";
import { Outlet } from "react-router-dom";

export default function MainLayout({ children }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="flex flex-1 flex-col min-h-screen bg-background">
        <Topbar />
        <main className="mx-auto size-full max-w-360 flex-1 px-4 py-6 sm:px-6 space-y-6">
          {children || <Outlet />}
        </main>
        <Footer />
      </SidebarInset>
    </SidebarProvider>
  );
}