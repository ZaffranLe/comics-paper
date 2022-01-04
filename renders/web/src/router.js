import React from "react";
import {
    BrowserRouter,
    Routes,
    Route
  } from "react-router-dom";
// pages
import Home from "./pages/home";
// components
import { UserLayout } from "./components";

function AppRouter() {
    return <>
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<UserLayout />}>
                    <Route index element={<Home />} />
                </Route>
            </Routes>
        </BrowserRouter>
    </>
}

export default AppRouter;