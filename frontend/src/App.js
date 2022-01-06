import './App.css';
import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Home from "./component/Home";
import ObjectPage from "./component/ObjectPage";
import Auction from "./component/Auction";
import NavBar from "./component/Navbar";

function App() {
  return (
    <div className="App">
      <NavBar />
      <Router>
        <Switch>
          <Route exact path="/">
            <Home />
          </Route>
          <Route exact path="/auction">
            <Auction />
          </Route>
          <Route exact path="/objectpage">
            <ObjectPage />
          </Route>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
