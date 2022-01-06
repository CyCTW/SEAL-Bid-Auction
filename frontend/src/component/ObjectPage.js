import React from "react";
import { Grid, Image, Input, Segment } from 'semantic-ui-react'



const mainStyle = {
  display: 'grid',
  gridTemplateColumns: '10% 40% 35% 15%',
  height: '75vh',
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

const ObjectPage = () => (
  <div class="container">
    <div class="row" style={mainStyle}>
      <div style={leftStyle}>
        <input type="image" style={button_style} src={require("./img/grabber_1.jpg")} onClick={() => document.getElementById("big_image").src = require("./img/grabber_1.jpg")}/>
        <input type="image" style={button_style} src={require("./img/grabber_2.jpg")} onClick={() => document.getElementById("big_image").src = require("./img/grabber_1.jpg")}/>
        <input type="image" style={button_style} src={require("./img/grabber_3.jpg")} onClick={() => document.getElementById("big_image").src = require("./img/grabber_1.jpg")}/>
        <input type="image" style={button_style} src={require("./img/grabber_4.jpg")} onClick={() => document.getElementById("big_image").src = require("./img/grabber_1.jpg")}/>
      </div>
      <div>
        <Image id="big_image" src={require("./img/grabber_1.jpg")} rounded />
      </div>
      <div>
        <h1>4K HDMI Grabber</h1>
        <div className="ui secondary pointing menu">
          <a className="item" onClick={() => document.getElementById("text").innerHTML = "The Pengo 4K HDMI Grabber is designed to support a 4K UHD Video input and capture audio/video at 1080p 60fps via USB. Transferring audio/video between the grabber and your PC/NB via USB easily enables streamers to capture each sound and movement. Using the Pengo 4K HDMI Grabber will allow a stable video capture in FHD at 60 fps without affecting the performance of your computer."}>
            Description
          </a>
          <a className="item" onClick={() => document.getElementById("text").innerHTML = "Supports HDMI 2.0 and UHD resolution up to 4K at 60 frames per second."}>
            Features
          </a>
        </div>
        <div className="ui basic segment">
          <p align="left" id="text">The Pengo 4K HDMI Grabber is designed to support a 4K UHD Video input and capture audio/video at 1080p 60fps via USB. Transferring audio/video between the grabber and your PC/NB via USB easily enables streamers to capture each sound and movement. Using the Pengo 4K HDMI Grabber will allow a stable video capture in FHD at 60 fps without affecting the performance of your computer.</p>
        </div>
      </div>
      <div class="ui segment">
        <p>Recommendations</p>
      </div>
    </div>
    <div class="row" style={bidStyle}>
      <div class="ui action input">
        <input type="text" placeholder='Please enter your bid price.'/>
        <button class="ui large button" onClick={() => window.location = '/auction'}>Bid!</button>
      </div>
      <button class="ui large button">View</button>
    </div>
  </div>
);

export default ObjectPage;

// <Image src={require("./img/logo192.png")} size='tiny' rounded/> 