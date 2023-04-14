import React from "react";
import { HashRouter, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const AppHeader = React.lazy(() => import("./components/AppHeader/AppHeader"));

import Home from "./components/Home/Home";
import { Suspense } from "react";
import Users from "./components/Users/Users";
import Register from "./components/Users/Register/Register";
import Login from "./components/Users/Login/Login";
import Logout from "./components/Users/Logout/Logout";

function App() {
  return (
    <HashRouter>
      {/* App header */}
      <Suspense children={<div>Loading...</div>}>
        <AppHeader />
      </Suspense>

      <Routes>
        <Route
          path="/"
          index
          element={
            <Suspense>
              <Home />
            </Suspense>
          }
        />
        <Route path="/users" element={<Users />}>
          <Route path="/users/register" element={<Register />}></Route>
          <Route path="/users/login" element={<Login />}></Route>
          <Route path="/users/logout" element={<Logout />}></Route>
        </Route>
      </Routes>

      <ToastContainer />
    </HashRouter>
  );
}

export default App;
