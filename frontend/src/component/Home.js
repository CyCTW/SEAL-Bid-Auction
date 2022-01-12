import React from "react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom/cjs/react-router-dom.min";
import Card from "./Card";
import { getAuction } from "../utils";
import NewAuctionModal from "./NewAuctionModal";

const HomePage = ({auctionsId}) => {
  const [auctions, setAuctions] = useState(null)

  useEffect(() => {
    const func = async () => {
      let auctionsData = [];
      for (let i = 0; i < auctionsId.length; i++) {
        let auction = await getAuction(auctionsId[i]);
        auctionsData.push(auction);
        console.log(auction);
      }
      
      setAuctions(auctionsData);
    }

    func();
  }, [auctionsId])

  console.log("Auction", auctions)
  return (
    <>
    <div className="container"> 
      <div className="row">
        <div className="column">
          <div className="ui three column grid">
            {
              auctions && auctions.map( (auction) => {
                return (
                  <Link to={`/${auction.id}`}  key={auction.id}>
                    <div className="column">
                      <Card
                        name={auction.name}
                        expired_date={auction.expired_date}
                        img={auction.imgs}
                      />
                    </div>
                  </Link>
                )
              })
            }
          </div>
        </div>
      </div>
    </div>
    <NewAuctionModal />
  </>
  )
};

export default HomePage;