import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
// pages
import Home from "./pages/home";
import Series from "./pages/series";
// components
import { UserLayout } from "./components";

function AppRouter() {
    return (
        <>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<UserLayout />}>
                        <Route index element={<Home />} />
                        <Route path="series" element={<Series />} />
                    </Route>
                    <Route path="*" element={<Home />} />
                </Routes>
            </BrowserRouter>
        </>
    );
}

export default AppRouter;
