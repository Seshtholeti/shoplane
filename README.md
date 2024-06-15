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

this is my authConfig.js

import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { PublicClientApplication, EventType } from "@azure/msal-browser";
import { msalConfig } from "./authConfig";

const msalInstance = new PublicClientApplication(msalConfig);

if (
  !msalInstance.getActiveAccount() &&
  msalInstance.getAllAccounts().length > 0
) {
  msalInstance.setActiveAccount(msalInstance.getActiveAccount()[0]);
}

msalInstance.addEventCallback((event) => {
  if (event.eventType === EventType.LOGIN_SUCCESS && event.payload.account) {
    const account = event.payload.account;
    msalInstance.setActiveAccount(account);
  }
});


const root = ReactDOM.createRoot( document.getElementById('root'));
root.render(
  <App instance = {msalInstance}/>
)

this is my index.js

import React from "react";
import "./App.css";
import Dashboard from "./Dashboard";
import Header from "./Header";
import Footer from "./Footer";
import {
  AuthenticatedTemplate,
  UnauthenticatedTemplate,
  useMsal,
  MsalProvider,
} from "@azure/msal-react";
import { loginRequest } from "./authConfig";

const WrappedView = () => {
  const { instance } = useMsal();
  const activeAccount = instance.getActiveAccount();

  const handleRedirect = () => {
    instance
      .loginRedirect({
        ...loginRequest,
        prompt: "create",
      })
      .catch((error) => console.log(error));
  };

  return (
    <div className="App">
      <AuthenticatedTemplate>
        {activeAccount ? <p>Authenticated Successfully</p> : null}
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


here, after the successful authentication I have to return the components below in the function app.

function App() {
  return (
    <div className="App">
      <header>{/* <h1>QuickSight Dashboard</h1> */}</header>
      <main>
        <Header />
        <Dashboard />
        <Footer />
      </main>
    </div>
  );
}
export default App;

please modify my app.js accordingly
