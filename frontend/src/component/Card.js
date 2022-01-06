import React from 'react'
import { Button, Header, Icon, Image, Segment } from 'semantic-ui-react'

const cardStyle = {
  height: '40vh',
}

const imgStyle ={
  width: '30vw',
  height: '25vh',
}

const Card = () => (
  <Segment style={cardStyle}>
    <Header>
      <Image src={require("./img/img.png")} style={imgStyle} rounded />
    </Header>
    <Segment.Inline>
      <button class="ui primary button" onClick={() => window.location = '/objectpage'}>Join</button>
      <button class="ui button">View</button>
    </Segment.Inline>
  </Segment>
)

export default Card
