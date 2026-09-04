import SideBar from "./SideBar";
import TopBar from "./TopBar";
import BottomNav from "./BottomNav";
import { Outlet } from "react-router-dom";

export default function Layout() {
  return (
    <div className="flex h-dvh overflow-hidden bg-[#060a0f]">
      <SideBar />
      <div className="flex min-w-0 flex-1 flex-col">
        <TopBar />
        <div className="flex min-h-0 flex-1 flex-col pb-16 desktop:pb-0">
          <Outlet />
        </div>
      </div>
      <BottomNav />
    </div>
  );
}
