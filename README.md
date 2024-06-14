import React from "react";
import "./App.css";
import Dashboard from "./Dashboard";
import Header from "./Header";
import Footer from "./Footer";
import { MsalAuthenticationTemplate, useMsal } from "@azure/msal-react";
import { InteractionType } from "@azure/msal-browser";
import { loginRequest } from "./authConfig";
const App = () => {
  const { instance, accounts } = useMsal();
  const handleLogin = () => {
    instance.loginPopup(loginRequest).catch((e) => {
      console.error(e);
    });
  };
  const isAuthenticated = accounts.length > 0;
  return (
    <div className="App">
      <header>{/* <h1>QuickSight Dashboard</h1> */}</header>
      <main>
        {isAuthenticated ? (
          <Dashboard />
        ) : (
          <button onClick={handleLogin}>Login</button>
        )}
      </main>
      {isAuthenticated && <Footer />}
    </div>
  );
};
export default App;
