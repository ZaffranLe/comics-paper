import React from "react";
import { Outlet } from "react-router-dom";

function UserLayout() {
    return <>
        <nav>
            <h1 className="bg-zinc-400 dark:bg-gray-900">Navbar</h1>
        </nav>
        <main>
            <Outlet />
        </main>
    </>
}

export default UserLayout;