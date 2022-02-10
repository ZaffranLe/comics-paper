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

function getAllUser() {
    return api({
        url: "/v1/users",
        method: "GET",
    });
}

function updateUser(user) {
    return api({
        url: `/v1/users/${user.id}`,
        method: "PUT",
        data: user,
    });
}

function getProfile() {
    return api({
        url: "/v1/users/profile",
        method: "GET",
    });
}

function updateProfile(user) {
    return api({
        url: "/v1/users/profile",
        method: "PUT",
        data: user,
    });
}

export {
    register,
    login,
    getUserInfo,
    getAllUser,
    updateUser,
    getProfile,
    updateProfile,
};
