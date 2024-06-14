import React from "react";
import "./App.css";
import Dashboard from "./Dashboard";
import Header from "./Header";
import Footer from "./Footer";
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

this is my app.js file


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

this is my authConfig.js file


import { publicClientApplication } from '@azure/msal-browser'


class App extends Component {


constructor(props){
super(props);
this.state = {
error: null;
isAuthenticated: false,
user: {}
this.login = this.login.bind(this)
this.publicClientApplication = new publicApplication({
auth: {
clientId; authConfig.appId,
redirectUri: authConfig.redirectUri,
authority: authConfig.authority
},
cache: {
cacheLoaction: "sessionStorage",
storeAuthStateInCookie: true
}

}};

}
async login (){
try {
await this.publicClientApplication.loginPopup(
{
scopes: authConfig.scopes,
prompt: "select_account"
});
this.setState({isAuthenticated:true})
}
catch(err){
this.setState({
isAutenticated: false,
user: {},
error: err
});
}
}

logout(){
this.publicApplication.logout();
}

render(){

return(
<div className ="App">
<header className="App-header">
{this.state.IsAuthenticated ? <p>
Successfully logged in </p>
: <p>
<button onClick = {() => this.logi()}>Login in</button>
</p>
}

</header>

</div>
);
}
}

export default App;

this is a refernce code I have got, please modify my app.js with respective to the reference code, and after successful login, it has to open the main content. please use class component only as above
