import axios from "axios";

const apiCall = axios.create({});

apiCall.interceptors.request.use(
    async (config) => {
        const token = localStorage.getItem("token");
        if (token) {
            config.headers["Authorization"] = `Bearer ${token}`;
        }

        config.baseURL = import.meta.env.VITE_ORIGIN_BACKEND;

        return config;
    },
    (error) => Promise.reject(error)
);

apiCall.interceptors.response.use(
    (response) => response,
    async (error) => {
        return Promise.reject(error);
    }
);

export default apiCall;
