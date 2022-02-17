import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
// pages
// -- user
import Home from "./pages/home";
import Series from "./pages/series";
import SerieDetail from "./pages/series/detail";
import SerieChapter from "./pages/series/chapter";
// -- admin
import AdminDashboard from "./pages/admin/dashboard";
import AdminUsers from "./pages/admin/users";
import AdminBookTags from "./pages/admin/book-tags";
import AdminSeries from "./pages/admin/series";
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
                        <Route path="series/:url" element={<SerieDetail />} />
                        <Route path="series/:url/chapter/:chapterUrl" element={<SerieChapter />} />
                        <Route path="*" element={<Home />} />
                    </Route>
                    <Route path="/dashboard" element={<AdminLayout />}>
                        <Route index element={<AdminDashboard />} />
                        <Route path="users" element={<AdminUsers />} />
                        <Route path="book-tags" element={<AdminBookTags />} />
                        <Route path="series" element={<AdminSeries />} />
                    </Route>
                </Routes>
            </BrowserRouter>
        </>
    );
}

export default AppRouter;
