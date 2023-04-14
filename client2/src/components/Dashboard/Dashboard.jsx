import React from "react";
import DashboardAsideMenu from "./DashboardAsideMenu";
import { Outlet } from "react-router-dom";

export default function Dashboard() {
  return (
    <div className="flex flex-row">
      {/* Dashboard aside menu  */}
      <div className="w-1/5 ">
        <DashboardAsideMenu />
      </div>

      {/* Dashboard main */}
      <div className="w-4/5">
        <Outlet />
      </div>
    </div>
  );
}
