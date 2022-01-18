import React from "react";
import { Link } from "react-router-dom/cjs/react-router-dom.min";
import Card from "../components/products/Card";
import NewAuctionModal from "../components/NewAuctionModal";
import { getAuctions } from "../components/api/utils";
import { useState, useEffect } from "react";

const mainStyle = {
  position: "fixed",
  top:'95%',
  left: '85%'
}

const HomePage = () => {
  const [auctions, setAuctions] = useState(null)
  const [fetch, setFetch] = useState(1)

  useEffect(() => {
    getAuctions().then(
      ({data}) => {
        for(let i=0; i<data.length; i++) {
          let d = data[i]
          const expired_date = new Date(d.expired_date)
          // expired_date.setHours(expired_date.getHours() + 8)
          data[i].expired_date = expired_date.toString().slice(0, 24)
        }
        setAuctions(data)
        console.log(data)
      }
    ).catch((err) => {
      console.log(err)
    })
  }, [fetch])

  console.log("Auction", auctions);
  return (
    <>
      <div className="container">
        <div className="row">
          <div className="column">
            <div className="ui three column grid">
              {auctions && auctions.map((auction) => {
                return (
                  // <Link to={`/${auction.id}`} key={auction.id}>
                    <div className="column" key={auction.id}>
                      <Card
                        id={auction.id}
                        name={auction.name}
                        expired_date={auction.expired_date}
                        img={auction.imgs}
                        setFetch={setFetch}
                      />
                    </div>
                  // </Link>
                );
              })}
            </div>
          </div>
        </div>
      </div>
      <div style={mainStyle}>
        <NewAuctionModal setFetch={setFetch}/>
      </div>
    </>
  );
};

export default HomePage;
