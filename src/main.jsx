import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "@emotion/react";
import { theme } from "./theme.js";
import { Provider } from "react-redux";
import store from "./store/index.js";
import { Auth0Provider } from "@auth0/auth0-react";

createRoot(document.getElementById("root")).render(
  <Auth0Provider
    domain="dev-st4ex8mtmrznbeji.us.auth0.com"
    clientId="f0auJdmZneXITCNMNJkz1wN9KVQSHd89"
    authorizationParams={{
      redirect_uri: window.location.origin + "/auth?type=login",
    }}
  >
    <StrictMode>
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <Provider store={store}>
            <App />
          </Provider>
        </ThemeProvider>
      </BrowserRouter>
    </StrictMode>
  </Auth0Provider>
);
