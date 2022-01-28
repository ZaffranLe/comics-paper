import api from "./api-call";

function getAllUser() {
    return api({
        url: "/v1/users",
        method: "GET",
    });
}

function createUser(user) {
    return api({
        url: "/v1/users",
        method: "POST",
        data: user,
    });
}

export { getAllUser, createUser };
