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


this is another app, need to add azure ad  login to this as well
