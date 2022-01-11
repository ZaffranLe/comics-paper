import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
// pages
// -- user
import Home from "./pages/home";
import Series from "./pages/series";
// -- admin
import Dashboard from "./pages/admin/dashboard";
// components
import { AdminLayout, UserLayout } from "./components";

function AppRouter() {
    return (
        <>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<UserLayout />}>
                        <Route index element={<Home />} />
                        <Route path="series" element={<Series />} />
                        <Route path="*" element={<Home />} />
                    </Route>
                    <Route path="/dashboard" element={<AdminLayout />}>
                        <Route index element={<Dashboard />} />
                    </Route>
                </Routes>
            </BrowserRouter>
        </>
    );
}

export default AppRouter;
