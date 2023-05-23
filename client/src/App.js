import React from "react";
import AppRouter from "./router";
import * as authActions from "./redux/slices/auth";
import { library } from "@fortawesome/fontawesome-svg-core";
import {
    faAlignJustify,
    faBell,
    faBook,
    faChevronDown,
    faChevronRight,
    faSlidersH,
    faSpinner,
    faStar,
    faTags,
    faStarHalfAlt,
    faTimes,
    faTrophy,
    faUnlockAlt,
    faUser,
    faPlus,
    faAngleDoubleDown,
    faAngleDoubleUp,
    faMoon,
    faSun,
    faSearch,
    faEye,
} from "@fortawesome/free-solid-svg-icons";
import { faStar as faStarRegular } from "@fortawesome/free-regular-svg-icons";
import { useDispatch } from "react-redux";
import { checkTokenValid } from "./utils/common";

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
    faBook,
    faSpinner,
    faTags,
    faStarHalfAlt,
    faStarRegular,
    faPlus,
    faAngleDoubleDown,
    faAngleDoubleUp,
    faMoon,
    faSun,
    faSearch,
    faTimes,
    faEye
);

let isInit = false;

function App() {
    const dispatch = useDispatch();

    const fetchProfile = async () => {
        const tokenValid = checkTokenValid();
        dispatch(authActions.setAuthenticated(tokenValid));
        if (tokenValid) {
            dispatch(authActions.getProfile());
        }
        isInit = true;
    };

    React.useEffect(() => {
        if (!isInit) {
            fetchProfile();
        }
    }, []);

    return (
        <>
            <AppRouter />
        </>
    );
}

export default App;
