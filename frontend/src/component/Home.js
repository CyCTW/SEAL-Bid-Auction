import React from "react";
import Card from "./Card";

const Home = () => (
  <div class="container"> 
    <div class="row">
      <div class="column">
        <div class="ui three column grid">
          <div class="column">
            <Card/>
          </div>
          <div class="column">
            <Card/>
          </div>
          <div class="column">
            <Card/>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default Home;