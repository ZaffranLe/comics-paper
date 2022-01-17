import axios from "axios";
import configs from "../configs/configs.cfg";

const apiCall = axios.create({});

apiCall.interceptors.request.use(
    async (config) => {
        // const token = localStorage.getItem("token");
        // config.headers["x-access-token"] = token;
        
        config.baseURL = configs.originBackend;

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
