import React, { useEffect, useState } from "react";
import {
  AuthenticatedTemplate,
  UnauthenticatedTemplate,
  useMsal,
  MsalProvider,
} from "@azure/msal-react";
import { loginRequest } from "./authConfig";
const WrappedView = () => {
  const { instance } = useMsal();
  const [activeAccount, setActiveAccount] = useState(
    instance.getActiveAccount()
  );
  useEffect(() => {
    const account = instance.getActiveAccount();
    console.log("useEffect: Current active account:", account);
    setActiveAccount(account);
  }, [instance]);
  const handleRedirect = () => {
    console.log("Initiating login redirect...");
    instance
      .loginPopup(loginRequest)
      .catch((error) => console.log("Login Redirect Error:", error));
  };
  return (
    <div className="App">
      <AuthenticatedTemplate>
        {activeAccount ? <p>Authenticated Successfully</p> : <p>Loading...</p>}
      </AuthenticatedTemplate>
      <UnauthenticatedTemplate>
        <button onClick={handleRedirect}>Sign up</button>
      </UnauthenticatedTemplate>
    </div>
  );
};
const App = ({ instance }) => {
  return (
    <MsalProvider instance={instance}>
      <WrappedView />
    </MsalProvider>
  );
};
export default App;


this is my app.js

export const msalConfig = {
  auth: {
    clientId: "39e0d8eb-57c0-4645-945d-732861666686",
    authority:
      "https://login.microsoftonline.com/e0e80fc4-4c12-4245-8bfd-c06791ad303a",
    redirectUri: "https://d2wg3nbq7bwdfq.cloudfront.net/index.html", // Ensure this is the correct URL
  },
  cache: {
    cacheLocation: "sessionStorage", // This will ensure the session is maintained during the browser session
    storeAuthStateInCookie: false,
  },
};
export const loginRequest = {
  scopes: ["User.Read"],
};


this is my authConfig.js

import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { PublicClientApplication, EventType } from "@azure/msal-browser";
import { msalConfig } from "./authConfig";

console.log(" index.js is running");
const msalInstance = new PublicClientApplication(msalConfig);
console.log("Initial active account:", msalInstance.getActiveAccount());
if (
  !msalInstance.getActiveAccount() &&
  msalInstance.getAllAccounts().length > 0
) {
  console.log("Setting active account to the first account in all accounts");
  msalInstance.setActiveAccount(msalInstance.getAllAccounts()[0]);
}
msalInstance.addEventCallback((event) => {
  if (event.eventType === EventType.LOGIN_SUCCESS && event.payload.account) {
    console.log("Login success event received. Setting active account.");
    msalInstance.setActiveAccount(event.payload.account);
  } else if (event.eventType === EventType.LOGIN_FAILURE) {
    console.error("Login failure event received:", event.error);
  } else {
    console.log("Event received:", event);
  }
});
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App instance={msalInstance} />);

this is my index.js


here, when I click on the sign up button, it has to redirect to the azure login, after successfull authentication , it has to display the dashboard. and also it is not generating tokens.
