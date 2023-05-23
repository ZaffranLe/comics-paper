import React from "react";
import { HashRouter, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
const AppHeader = React.lazy(() => import("./components/AppHeader/AppHeader"));

import Home from "./components/Home/Home";
import { Suspense } from "react";

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
      </Routes>

      <ToastContainer />
    </HashRouter>
  );
}

export default App;
