import api from "./api-call";

function register(user) {
    return api({
        url: "/v1/users/signup",
        method: "post",
        data: user,
    });
}

export { register };
