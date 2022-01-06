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

const Bid = ({binPrice, currentBinPrice}) => (
    <div style={segStyle}>
        <div className="ui left action input">
            <button className="ui teal button">
                Current Bid
            </button>
            <input type="text" value={`${currentBinPrice}`} />
        </div>
        <div></div>
        <div className="ui left action input">
            <button className="ui teal button">
                Your    Bid
            </button>
            <input type="text" value={`${binPrice}`} />
        </div>
    </div>
)

export default Bid
