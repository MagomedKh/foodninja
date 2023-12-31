import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import { ErrorBoundary } from "./components";
import { BrowserRouter as Router } from "react-router-dom";
import store from "./redux/store";
import { Provider } from "react-redux";
import bridge from "@vkontakte/vk-bridge";
import { _getPlatform, ScrollToTop } from "./components/helpers";
if (_getPlatform() === "vk") bridge.send("VKWebAppInit");

ReactDOM.render(
    <React.StrictMode>
        <Router>
            <ErrorBoundary>
                <Provider store={store}>
                    <ScrollToTop />
                    <App />
                </Provider>
            </ErrorBoundary>
        </Router>
    </React.StrictMode>,
    document.getElementById("root")
);
