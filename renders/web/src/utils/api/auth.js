import api from "./api-call";

function register(user) {
    return api({
        url: "/v1/users/signup",
        method: "POST",
        data: user,
    });
}

function login(user) {
    return api({
        url: "/v1/users/signin",
        method: "POST",
        data: user,
    });
}

function getUserInfo(id) {
    return api({
        url: `/v1/users/${id}`,
        method: "GET",
    });
}

export { register, login, getUserInfo };
