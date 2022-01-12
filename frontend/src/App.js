import './App.css';
import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Home from "./component/Home";
import ObjectPage from "./component/ObjectPage";
import NavBar from "./component/Navbar";
import { useState, useEffect } from "react";
import { getAuctions, web3 } from "./utils";
import Auction from './pages/Auction'

function App() {
  const [auctions, setAuctions] = useState(null)
  const [account, setAccount] = useState(null)

  useEffect(() => {
    const func = async () => {
      let accounts = await web3.eth.getAccounts();

      web3.eth.defaultAccount = accounts[0];
      setAccount(accounts[0]);

      try {
        let data = await getAuctions();

        // for (let i = 0; i < data.length; i++) {
        //   let d = data[i];
        //   console.log(d);
        //   // const expired_date = new Date(d.expired_date)
        //   // expired_date.setHours(expired_date.getHours() + 8)
        //   // data[i].expired_date = expired_date.toString()
        // }
        setAuctions(data);
      } catch (err) {
        console.log(err);
      }
    }
    func();
  }, [])

  return (
    <Router>
      <NavBar account={account} setAccount={setAccount} />

      <Switch>
        <Route path="/:auctionId">
          <Auction />
        </Route>
        <Route path="/">
          {auctions && <Home auctions={auctions} />}
        </Route>
      </Switch>
    </Router>
  )
}

export default App;
