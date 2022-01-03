
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
    const [pubkey_proof, pubkey_publics, private_keys] = await generatePublicKeyNIZKProof(BigInt(id))
    const groups = await init_schnorr_group()
    
    // optional
    verifyPublicKeyNIZKProof(pubkey_proof, groups, pubkey_publics)
    bigIntToString(pubkey_proof)
    bigIntToString(pubkey_publics)
    let private_keys_ = {...private_keys, iter}
    
    return [{pubkey_publics, pubkey_proof, iter, id}, private_keys_]
}

export default function RoundOne({socket, Id, pubKeys, setPubKeys, numOfParticipants, iter, roundState, setRoundState,
    privateKeys, setPrivateKeys}) {
    // const [iter, setIter] = useState(1)
    const [isSubmittedRoundOne, setIsSubmittedRoundOne] = useState(false)

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

    useEffect(() => {
        if (pubKeys.length === iter * numOfParticipants) {
            setIsSubmittedRoundOne(false)

            setRoundState(2)
          }
    }, [pubKeys])

    const sendPubkeys = async () => {
        // TODO: change to socketio id
        const [pubkey, privatekey] = await execRoundOne(iter, Id)
        setPrivateKeys([...privateKeys, privatekey])
        socket.emit('round1', JSON.stringify(pubkey) )
        setIsSubmittedRoundOne(true)
    }
    console.log("RoundOneKeys: ", pubKeys)
    return (
        <div>
        {roundState === 1 ? 
        <div>
            {isSubmittedRoundOne ? 
                   <div>You have submitted round one... wait for others</div> : 
                  <div>
                    <h1> Now is Round 1, iteration: {iter}..... </h1> </div>}
            <input type='button' value='Send roundOne' onClick={sendPubkeys} />
        </div> : <div></div>
        }
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