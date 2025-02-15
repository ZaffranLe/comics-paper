import axios from "axios";
import process from "process";
import { getToken, hasToken } from "../utils/TokenManager";

if (!process.env.HTTP_SERVER_API) {
  console.warn(
    "The application cannot determine process.env.HTTP_SERVE_API and now using the default url.",
  );
}

/**
 * Initialize the new instance of axios
 */
const AxiosInstance = axios.create({
  baseURL: process.env.HTTP_SERVER_API || "http://localhost:3000/v1/",
  timeout: 1000,
});

/**
 * Define request interceptor for application
 */
AxiosInstance.interceptors.request.use(
  function (config) {
    if (hasToken()) {
      config.headers["Authorization"] = `Bearer ${getToken()}`;
    }
    return config;
  },
  function error(error) {
    return Promise.reject(error);
  },
);

/**
 * Define response interceptor for application
 */
AxiosInstance.interceptors.response.use(
  function (response) {
    // 2xx catch
    return response;
  },
  function (error) {
    // Print mortal error using group
    if (process.env.NODE_ENV !== "production") {
      console.group("Axios exceptions");
      console.log("Response: ", error.response);
      if (error.response !== undefined) {
        console.log(error.response.data);
      }
      console.log(error);
      console.groupEnd();
    }
    return Promise.reject(error);
  },
);

export default AxiosInstance;
