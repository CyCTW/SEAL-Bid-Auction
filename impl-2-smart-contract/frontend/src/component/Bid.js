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
<<<<<<< HEAD:impl-1-websocket/frontend/src/components/boards/Bid.js
            <input type="text" disabled value={currentBinPrice ? `${currentBinPrice}` : ""} />
=======
            <button className="ui button">{currentBinPrice ? `${currentBinPrice}` : ""}</button>
>>>>>>> smart-contract:impl-2-smart-contract/frontend/src/component/Bid.js
        </div>
        <div></div>
        <div className="ui left action input">
            <button className="ui teal button">
                Your    Bid
            </button>
<<<<<<< HEAD:impl-1-websocket/frontend/src/components/boards/Bid.js
            <input type="text" disabled value={`${binPrice}`} />
=======
            <button className="ui button">{`${binPrice}`}</button>
>>>>>>> smart-contract:impl-2-smart-contract/frontend/src/component/Bid.js
        </div>
    </div>
)

export default Bid
