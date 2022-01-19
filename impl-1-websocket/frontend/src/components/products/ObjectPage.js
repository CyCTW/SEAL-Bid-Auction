import React from "react";
import { Grid, Image, Input, Segment } from 'semantic-ui-react'
import totalBits from "../../env";



const mainStyle = {
  display: 'grid',
  gridTemplateColumns: '85% 15%',
  height: '40vh',
  margin: '2vh',
}

const button_style = {
  width:  '100px',
  height: '100px',
}

const leftStyle = {
  display: 'grid',
  gridTemplateRows: '8vw 8vw 8vw 8vw',
}

const bidStyle = {
  display: 'grid',
  height:'10vh',
  gridTemplateColumns: '84% 14%',
}

const ObjectPage = ({sendCommitment, viewCommitment, setPrice, isSubmittedCommitment, timeLeft, auctionDetail}) => (
  <div className="container">
    <div className="row" style={mainStyle}>
      {/* <div style={leftStyle}>
        <input type="image" style={button_style} src={require("./img/grabber_1.jpg")} onClick={() => document.getElementById("big_image").src = require("./img/grabber_1.jpg")}/>
        <input type="image" style={button_style} src={require("./img/grabber_2.jpg")} onClick={() => document.getElementById("big_image").src = require("./img/grabber_1.jpg")}/>
        <input type="image" style={button_style} src={require("./img/grabber_3.jpg")} onClick={() => document.getElementById("big_image").src = require("./img/grabber_1.jpg")}/>
        <input type="image" style={button_style} src={require("./img/grabber_4.jpg")} onClick={() => document.getElementById("big_image").src = require("./img/grabber_1.jpg")}/>
      </div> */}
      {/* <div> */}
        {/* <Image id="big_image" src={require("./img/grabber_1.jpg")} rounded /> */}
      {/* </div> */}
      <div>
        <h1>{auctionDetail.name}</h1>
        <div className="ui secondary pointing menu">
          <a className="item" onClick={() => document.getElementById("text").innerHTML = auctionDetail.description}>
            Description
          </a>
        </div>
        <div className="ui basic segment">
          <p align="left" id="text">{auctionDetail.description}</p>
        </div>
      </div>
      <div className="ui segment">
        <p>{auctionDetail && `Remain: ${timeLeft.days} Days ${timeLeft.hours} Hours ${timeLeft.minutes} min ${timeLeft.seconds} sec`}</p>
      </div>
    </div>
    <div>Enter your bid price from 1 to {2**totalBits-1}</div>

    <div className="row" style={bidStyle}>
      <div className="ui action input">
        <input type="text" placeholder='Please enter your bid price.' onChange={(e) => setPrice(e.target.value)}/>
        <button className={isSubmittedCommitment ? "ui large disabled button": "ui large button"} onClick={sendCommitment}>Bid!</button>
      </div>
      <button className="ui large button" onClick={viewCommitment}>View</button>
    </div>
  </div>
);

export default ObjectPage;

// <Image src={require("./img/logo192.png")} size='tiny' rounded/> 