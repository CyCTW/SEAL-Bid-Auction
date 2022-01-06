import React from "react";
import Blackboard from "./Blackboard";
import Bid from "./Bid";
import Voterboard from "./Voterboard";
import Timer from "./Timer";


const mainStyle = {
  display: 'grid',
  gridTemplateColumns: '78vw 20vw',
}

const leftStyle = {
  padding: '2vh',
  display: 'grid',
  gridTemplateRows: '68vh 28vh',
}

const rightStyle = {
  padding: '2vh',
  display: 'grid',
  gridTemplateRows: '68vh 28vh',
}

const boardStyle = {
  height: '60vh',
}

const Auction = () => (
  <div style={mainStyle}>
    <div style={leftStyle}>
      <Blackboard style={boardStyle} />
      <Bid />
    </div>
    <div style={rightStyle}>
      <Voterboard />
      <Timer />
    </div>
  </div>
);

export default Auction;