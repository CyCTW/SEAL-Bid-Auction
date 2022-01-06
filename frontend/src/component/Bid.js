import React from 'react'
import { Button, Header, Icon, Image, Segment } from 'semantic-ui-react'

const segStyle = {
    padding: '2vh',
    paddingTop: '5vh',
    display: 'grid',
    gridTemplateRows: '8vh 3vh 8vh',
}

const imgStyle = {
    width: '30vw',
    height: '25vh',
}

const Bid = () => (
    <div style={segStyle}>
        <div class="ui left action input">
            <button class="ui teal button">
                Current Bid
            </button>
            <input type="text" value="" />
        </div>
        <div></div>
        <div class="ui left action input">
            <button class="ui teal button">
                Your    Bid
            </button>
            <input type="text" value="" />
        </div>
    </div>
)

export default Bid
