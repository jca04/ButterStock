import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import axios from "axios";
import { Provider } from "react-redux";
import { store } from "./app/store.js";

// axios.defaults.baseURL = "http://localhost:3000/api";
axios.defaults.baseURL = "https://butterstock.onrender.com/api";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);
