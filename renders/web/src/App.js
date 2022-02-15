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
    faStarHalfAlt,
    faTimes,
    faTrophy,
    faUnlockAlt,
    faUser,
} from "@fortawesome/free-solid-svg-icons";
import { faStar as faStarRegular } from "@fortawesome/free-regular-svg-icons";
import { useDispatch } from "react-redux";
import { checkTokenValid } from "./utils/common";
import jwtDecode from "jwt-decode";
import * as userApi from "./utils/api/users";

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
    faStar,
    faStarHalfAlt,
    faStarRegular
);

function App() {
    const dispatch = useDispatch();

    const fetchProfile = async () => {
        const tokenValid = checkTokenValid();
        dispatch(authActions.setAuthenticated(tokenValid));
    };

    React.useEffect(() => {
        fetchProfile();
    }, []);

    return (
        <>
            <AppRouter />
        </>
    );
}

export default App;
