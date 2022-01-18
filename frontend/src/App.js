import "./App.css";
import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import NavBar from "./components/Navbar";
import Auction from "./pages/Auction";

function App() {
  return (
    <Router>
      <NavBar />

      <Switch>
        <Route path="/:auctionId">
          <Auction />
        </Route>
        <Route path="/">
          <HomePage />
        </Route>
        
      </Switch>
    </Router>
  );
}

export default App;
