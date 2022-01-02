
import { generatePublicKeyNIZKProof, verifyPublicKeyNIZKProof } from "../zk-proof/publicKeyProof";
import { init_schnorr_group } from "../zk-proof/utils";
import { bigIntToString } from "./utils";
import { useState, useEffect } from 'react'

const execRoundOne = async (iter, id) => {
    /*
    Compute the stageOne of public key and zk-proof, then
    submited to public bulletin.
    ---
    Input
    round:
    id:
    */
    const [pubkey_proof, pubkey_publics] = await generatePublicKeyNIZKProof(BigInt(id))
    const groups = await init_schnorr_group()
    
    // optional
    verifyPublicKeyNIZKProof(pubkey_proof, groups, pubkey_publics)
    bigIntToString(pubkey_proof)
    bigIntToString(pubkey_publics)
    return {pubkey_publics, pubkey_proof, iter, id}
}

export default function RoundOne({socket, Id}) {
    const [pubKeys, setPubKeys] = useState([])
    const [iter, setIter] = useState(1)
    useEffect(() =>{
        socket.on('round1', message => {
            
            const pubKey = JSON.parse(message)
            console.log("Received: ", pubKey)
            
            setPubKeys((prevPubkeys) => {
              const newPubkeys = [ ...prevPubkeys, pubKey ]
            //   newCommitment.push(commitment)
              return newPubkeys
            })
        })
    }, [socket])
    

    const sendPubkeys = async () => {
        // TODO: change to socketio id
        const pubkey = await execRoundOne(iter, Id)
        socket.emit('round1', JSON.stringify(pubkey) )
    }
    console.log("Total: ", pubKeys)
    return (
        <div>
            <input type='button' value='Send roundOne' onClick={sendPubkeys} />
        </div>
    )
}
/* 
pubkeys structure:
[
    { 
        iter: 1,
        id: 3,
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