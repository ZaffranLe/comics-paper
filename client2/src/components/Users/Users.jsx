import React from "react";
import { Outlet } from "react-router-dom";

function Users() {
  return (
    <div className="dark:bg-neutral-600">
      {/* User */}
      <Outlet />
    </div>
  );
}

export default Users;
