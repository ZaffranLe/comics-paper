// import react from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import App from "./App";
import "./index.css";
import { store } from "./store";

createRoot(document.getElementById("app")).render(
  <Provider store={store}>
    <App />
  </Provider>
);
