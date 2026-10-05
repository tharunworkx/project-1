import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import { Outlet } from "react-router-dom";

export default function MainLayout({ children }) {

  return (
    <div className="min-h-screen bg-[#f7f5ef]">

      <Sidebar />

      <Topbar />

      <main className="
        ml-[255px]
        min-h-screen
        pt-[68px]
      ">

        <div className="px-7 py-7">

          {children || <Outlet />}

        </div>

      </main>

    </div>
  );
}