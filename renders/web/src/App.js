import React from "react";
import AppRouter from "./router";
import { library } from "@fortawesome/fontawesome-svg-core";
import {
    faAlignJustify,
    faBell,
    faChevronDown,
    faChevronRight,
    faSlidersH,
    faStar,
    faTimes,
    faTrophy,
} from "@fortawesome/free-solid-svg-icons";

library.add(
    faBell,
    faAlignJustify,
    faTimes,
    faTrophy,
    faStar,
    faSlidersH,
    faChevronDown,
    faChevronRight
);

function App() {
    return (
        <>
            <AppRouter />
        </>
    );
}

export default App;
