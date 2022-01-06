import React from 'react';
import Voter from "./Voter";
import { Grid } from 'semantic-ui-react';

const findProofs = (proofs, iter, id) => {
    for(let proof of proofs) {
        if (proof.iter === iter && proof.id === id) {
            return true
        }
    }
    return false
}

const VoterBoard = ({participantsIds, proofs, iter, id}) => {
    console.log("Parti id: ", participantsIds)
    console.log("Proofs: ", proofs)
    console.log("Iter: ", iter)

    return (
    <div className="ui segment">
        <div className="header">
            <h5>Voters that commmits successfully</h5>
            <h7>(Click to see its info on board.)</h7>
        </div>
        <div>
            <Grid columns='equal'>
                {participantsIds.map((participantId) => {
                    if (participantId !== id) {
                        return (
                        <Voter key={participantId} isSubmitted={findProofs(proofs, iter, participantId) }/>
                        )
                    }
                })
                }
            </Grid>

        </div>
    </div>
)
}
export default VoterBoard
