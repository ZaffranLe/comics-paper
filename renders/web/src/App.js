import React from "react";
import AppRouter from "./router";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faAlignJustify, faBell, faStar, faTimes, faTrophy } from "@fortawesome/free-solid-svg-icons";

library.add(faBell, faAlignJustify, faTimes, faTrophy, faStar);

function App() {
    return (
        <>
            <AppRouter />
        </>
    );
}

export default App;
