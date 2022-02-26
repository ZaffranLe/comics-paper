import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
// pages
// -- user
import Home from "./pages/home";
import Comics from "./pages/comics";
import ComicDetail from "./pages/comics/detail";
import ComicChapter from "./pages/comics/chapter";
// -- admin
import AdminDashboard from "./pages/admin/dashboard";
import AdminUsers from "./pages/admin/users";
import AdminBookTags from "./pages/admin/book-tags";
import AdminComics from "./pages/admin/comics";
import AdminComicDetail from "./pages/admin/comics/detail";
// components
import { AdminLayout, UserLayout } from "./components";

function AppRouter() {
    return (
        <>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<UserLayout />}>
                        <Route index element={<Home />} />
                        <Route path="comics" element={<Comics />} />
                        <Route path="comics/:url" element={<ComicDetail />} />
                        <Route path="comics/:url/chapter/:chapterUrl" element={<ComicChapter />} />
                        <Route path="*" element={<Home />} />
                    </Route>
                    <Route path="/dashboard" element={<AdminLayout />}>
                        <Route index element={<AdminDashboard />} />
                        <Route path="users" element={<AdminUsers />} />
                        <Route path="book-tags" element={<AdminBookTags />} />
                        <Route path="comics" element={<AdminComics />} />
                        <Route path="comics/:url" element={<AdminComicDetail />} />
                    </Route>
                </Routes>
            </BrowserRouter>
        </>
    );
}

export default AppRouter;
