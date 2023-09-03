import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

import reducers from "./reducers";
import { createStore, applyMiddleware, compose } from "redux";
import thunk from "redux-thunk";
import { Provider } from "react-redux";
const root = ReactDOM.createRoot(document.getElementById("root"));
const store = createStore(reducers, compose(applyMiddleware(thunk)));

root.render(
  <Provider store = {store}>
    <App />
  </Provider>
);
