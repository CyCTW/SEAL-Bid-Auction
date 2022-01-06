import React from 'react';
import Voter from "./Voter";
import { Grid } from 'semantic-ui-react';


const VoterBoard = () => (
    <div class="ui segment">
        <div class="header">
            <h5>Voters that commmits successfully</h5>
            <h7>(Click to see its info on board.)</h7>
        </div>
        <div>
            <Grid columns='equal'>
                <Voter/>
                <Voter/>
                <Voter/>
                <Voter/>
                <Voter/>
            </Grid>
            <Grid columns='equal'>
                <Voter/>
                <Voter/>
                <Voter/>
                <Voter/>
                <Voter/>
            </Grid>
        </div>
    </div>
)

export default VoterBoard
