import React, { useEffect, useState } from "react";
import "./App.css";
import Dashboard from "./Dashboard";
import Header from "./Header";
import Footer from "./Footer";
import { useMsal } from "@azure/msal-react";
import { loginRequest } from "./authConfig";
function App() {
  const { instance, accounts, inProgress } = useMsal();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  useEffect(() => {
    const checkAuthentication = async () => {
      const accounts = instance.getAllAccounts();
      if (accounts.length === 0 && inProgress === "none") {
        try {
          await instance.loginRedirect(loginRequest);
        } catch (error) {
          console.error("Login error:", error);
        }
      } else {
        setIsAuthenticated(true);
      }
    };
    checkAuthentication();
  }, [instance, inProgress]);
  if (!isAuthenticated) {
    return <div>Loading...</div>; // Show loading while checking authentication
  }
  return (
    <div className="App">
      <Header />
      <Dashboard />
      <Footer />
    </div>
  );
}
export default App;

this is my app.js

export const msalConfig = {
  auth: {
    clientId: "39e0d8eb-57c0-4645-945d-732861666686",
    authority:
      "https://login.microsoftonline.com/e0e80fc4-4c12-4245-8bfd-c06791ad303a",
    redirectUri: "https://d2wg3nbq7bwdfq.cloudfront.net/index.html",
  },
  cache: {
    cacheLocation: "sessionStorage",
    storeAuthStateInCookie: false,
  },
};
export const loginRequest = {
  scopes: ["User.Read"],
};

this is authConfig.js

import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { PublicClientApplication } from "@azure/msal-browser";
import { MsalProvider } from "@azure/msal-react";
import { msalConfig } from "./authConfig";
const msalInstance = new PublicClientApplication(msalConfig);
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <MsalProvider instance={msalInstance}>
    <App />
  </MsalProvider>
);


this is my index.js
