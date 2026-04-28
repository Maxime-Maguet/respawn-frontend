import SideBar from "./SideBar";
import TopBar from "./TopBar";
import { Outlet } from "react-router-dom";

export default function Layout() {
  return (
    <div className="flex h-screen bg-[#060a0f]">
      <SideBar />
      <div className="flex flex-col flex-1">
        <TopBar />
        <Outlet />
      </div>
    </div>
  );
}
