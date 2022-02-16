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
            return false;
        } else {
            return true;
        }
    } catch (e) {
        return false;
    }
}

export { classNames, checkTokenValid };
