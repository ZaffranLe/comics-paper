import React from "react";
import AppRouter from "./router";
import { library } from "@fortawesome/fontawesome-svg-core";
import {
    faAlignJustify,
    faBell,
    faBook,
    faChevronDown,
    faChevronRight,
    faSlidersH,
    faStar,
    faTimes,
    faTrophy,
    faUnlockAlt,
    faUser,
} from "@fortawesome/free-solid-svg-icons";

library.add(
    faBell,
    faAlignJustify,
    faTimes,
    faTrophy,
    faStar,
    faSlidersH,
    faChevronDown,
    faChevronRight,
    faUser,
    faUnlockAlt,
    faBook
);

function App() {
    return (
        <>
            <AppRouter />
        </>
    );
}

export default App;
