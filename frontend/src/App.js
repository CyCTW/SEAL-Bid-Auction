import './App.css';
import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Home from "./component/Home";
import ObjectPage from "./component/ObjectPage";
import NavBar from "./component/Navbar";
import { useState, useEffect } from "react";
import { getAuctions } from "./utils";
import Auction from './pages/Auction'

function App() {
  const [auctions, setAuctions] = useState(null)

  useEffect(() => {
    getAuctions().then(
      ({data}) => {
        for(let i=0; i<data.length; i++) {
          let d = data[i]
          const expired_date = new Date(d.expired_date)
          // expired_date.setHours(expired_date.getHours() + 8)
          data[i].expired_date = expired_date.toString()
        }
        setAuctions(data)
        console.log(data)
      }
    ).catch((err) => {
      console.log(err)
    })
  }, [])
  
  return (
      <Router>
        <NavBar />

        <Switch>
          <Route path="/:auctionId">
            <Auction />
          </Route>
          <Route path="/">
            {auctions && <Home auctions={auctions}/>}
          </Route>
        </Switch>
      </Router>
  )
}

export default App;
