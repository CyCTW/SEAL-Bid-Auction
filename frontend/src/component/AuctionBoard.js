import React from "react";
import Blackboard from "./Blackboard";
import Bid from "./Bid";
import Voterboard from "./Voterboard";
import Timer from "./Timer";

const mainStyle = {
  display: "grid",
  gridTemplateColumns: "78vw 20vw",
};

const leftStyle = {
  padding: "2vh",
  display: "grid",
  gridTemplateRows: "68vh 28vh",
};

const rightStyle = {
  padding: "2vh",
  display: "grid",
  gridTemplateRows: "68vh 28vh",
};

const boardStyle = {
  height: "60vh",
};

const AuctionBoard = ({ binPrice, currentBinPrice, sendProofs, isSubmitted, participantsIds, proofs, iter, id }) => (
  <div style={mainStyle}>
    <div style={leftStyle}>
      <Blackboard style={boardStyle} />
      <Bid binPrice={binPrice} currentBinPrice={currentBinPrice} />
      <button className={isSubmitted ?"ui teal disabled button" :"ui teal button"} onClick={sendProofs}>Send Proof</button>
    </div>
    <div style={rightStyle}>
      <Voterboard participantsIds={participantsIds} proofs={proofs} iter={iter} id={id}/>
      <Timer />
    </div>
  </div>
);

export default AuctionBoard;
