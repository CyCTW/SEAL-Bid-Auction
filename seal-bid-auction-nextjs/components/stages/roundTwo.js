
import { generatePublicKeyNIZKProof, verifyPublicKeyNIZKProof } from "../zk-proof/publicKeyProof";
import { init_schnorr_group } from "../zk-proof/utils";
import { generateStageOneNIZKProof, verifyStageOneNZIKProof } from "../zk-proof/stageOneProof";
import { generateStageTwoNIZKProof, verifyStageTwoNZIKProof } from "../zk-proof/stageTwoProof";
import { bigIntToString } from "./utils";
import { useState, useEffect } from 'react'


const execRoundTwo = async (iter, id, statement, isJunction) => {
    /*
    Compute the roundTwo of zk-proof, then
    submited to public bulletin.
    ---
    Input
    round:
    id:
    */
    const groups = await init_schnorr_group()
    let B = 0
    let B_proof = 0
    let B_publics = 0
    // TODO: Pass Yij into function
    if (isJunction) {
        [B_proof, B_publics] = await generateStageTwoNIZKProof(BigInt(statement), BigInt(id))
        
        // Optional
        verifyStageTwoNZIKProof(B_proof, groups, B_publics)
    } else {
        [B_proof, B_publics] = await generateStageOneNIZKProof(BigInt(statement), BigInt(id))
        // Optional
        verifyStageOneNZIKProof(B_proof, groups, B_publics)
    }
    bigIntToString(B_publics)
    bigIntToString(B_proof)
    
    return {B_publics, B_proof, iter, id}

}

export default function RoundTwo({socket, Id}) {
    const [roundTwoProofs, setRoundTwoProofs] = useState([])
    const [isJunction, setIsJunction] = useState(false)
    const [iter, setIter] = useState(1)

    useEffect(() =>{
        socket.on('round2', message => {
            
            const roundTwoProof = JSON.parse(message)
            console.log("Received: ", roundTwoProof)
            
            setRoundTwoProofs((prevRoundTwoProofs) => {
              const newProofs = [ ...prevRoundTwoProofs, roundTwoProof ]
              return newProofs
            })
        })
    }, [socket])
    

    const sendRoundTwoProof = async () => {
        // TODO: change to socketio id
        const statement = 1
        const roundTwoProof = await execRoundTwo(iter, Id, statement, isJunction)
        socket.emit('round2', JSON.stringify(roundTwoProof) )
    }
    console.log("Total: ", roundTwoProofs)
    return (
        <div>
            <input type='button' value='Send roundTwo' onClick={sendRoundTwoProof} />
        </div>
    )
}
/* 
pubkeys structure:
[
    { 
        iter: 1,
        id: 3,
        B,
        pubkey_publics, 
        pubkey_proof
    }, 
    {
        iter: 1,
        id: 4,
        pubkey_publics, 
        pubkey_proof
    }
]
*/
