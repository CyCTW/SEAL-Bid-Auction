import React from 'react'
import { Button, Header, Icon, Image, Segment } from 'semantic-ui-react'

const cardStyle = {
  height: '40vh',
}

const imgStyle ={
  width: '30vw',
  height: '25vh',
}

const Card = ({name, img, expired_date}) => (
  <Segment style={cardStyle}>
    <Header>
      <Image src={require("./img/img.png")} style={imgStyle} rounded />
    </Header>
    <h2>{name}</h2>
    <p>Expired Date: {expired_date.toString()}</p>
    <Segment.Inline>
      {/* <button class="ui primary button" onClick={() => window.location = '/objectpage'}>Join</button> */}
      <button className="ui primary button">Join</button>
      <button className="ui button">View</button>
    </Segment.Inline>
  </Segment>
)

export default Card
