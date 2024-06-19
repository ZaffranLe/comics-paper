import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import "react-toastify/dist/ReactToastify.css";
import "react-loading-skeleton/dist/skeleton.css";
import App from "./App";

import { Provider } from "react-redux";
import store from "./redux/store";
import { ToastContainer } from "react-toastify";

ReactDOM.render(
    <Provider store={store}>
        <App />
        <ToastContainer />
    </Provider>,
    document.getElementById("root")
);
