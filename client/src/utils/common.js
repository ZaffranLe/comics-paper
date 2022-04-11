import jwt_decode from "jwt-decode";

function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
}

function checkTokenValid() {
    const token = localStorage.getItem("token");
    try {
        const userInfo = jwt_decode(token);
        const expDate = new Date(userInfo.exp * 1000);
        const currentDate = new Date();
        if (expDate < currentDate) {
            localStorage.removeItem("token");
            return false;
        } else {
            return true;
        }
    } catch (e) {
        localStorage.removeItem("token");
        return false;
    }
}

function getUserInfoFromToken(token = null) {
    const _token = token || localStorage.getItem("token");
    try {
        const userInfo = jwt_decode(_token);
        return userInfo;
    } catch (e) {
        return null;
    }
}

export { classNames, checkTokenValid, getUserInfoFromToken };
