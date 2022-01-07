import React from "react";
import { Link } from "react-router-dom/cjs/react-router-dom.min";
import Card from "./Card";
import NewAuctionModal from "./NewAuctionModal";

const HomePage = ({auctions}) => {
  console.log("Auction", auctions)
  return (
    <>
    <div className="container"> 
      <div className="row">
        <div className="column">
          <div className="ui three column grid">
            {
              auctions.map( (auction) => {
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