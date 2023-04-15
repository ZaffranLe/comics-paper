import React from "react";
import DashboardAsideMenu from "./DashboardAsideMenu";
import { Navigate, Outlet, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { hasToken } from "../../utils/TokenManager";

export default function Dashboard() {
  const profile = useSelector((store) => store.App.profile);
  const navigate = useNavigate();

  /**
   * Check if the profile can access into the dashboard.
   *
   * @returns true if the profile can access into dashboard,
   *  false otherwise.
   */
  const didProfileHasAdminPermission = () => {
    if (profile === undefined || profile === null) {
      throw new Error(`Missing profile (undefined or null)`);
    }

    return profile.role.name !== "User";
  };

  // Return home if the client is failed to join dashboard
  if (!hasToken() || profile === null || !didProfileHasAdminPermission()) {
    return <Navigate to="/" />;
  }

  return (
    <div className="flex flex-row min-h-[90vh] mt-4">
      {/* Dashboard aside menu  */}
      <div className="w-1/5 ">
        <DashboardAsideMenu />
      </div>

      {/* Dashboard main */}
      <div className="w-4/5 px-2 py-4 mt-4">
        <Outlet />
      </div>
    </div>
  );
}
