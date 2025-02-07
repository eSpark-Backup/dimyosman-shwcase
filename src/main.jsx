import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "@emotion/react";
import { theme } from "./theme.js";
import { Provider } from "react-redux";
import store from "./store/index.js";
import SocketProvider from "./context/SocketContext.jsx";
import { Auth0Provider } from "@auth0/auth0-react";


const AUTH0_APP_DOMAIN = import.meta.env.VITE_AUTH0_APP_DOMAIN;
const GOOGLE_CLIENT_ID = import.meta.env.VITE_AUTH0_GOOGLE_APP_CLIENT_ID;

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Auth0Provider
      domain={AUTH0_APP_DOMAIN}
      clientId={GOOGLE_CLIENT_ID}
      authorizationParams={{
        redirect_uri: window.location.origin,
      }}
    >
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <Provider store={store}>
            <SocketProvider>
              <App />
            </SocketProvider>
          </Provider>
        </ThemeProvider>
      </BrowserRouter>
    </Auth0Provider>
  </StrictMode>
);
