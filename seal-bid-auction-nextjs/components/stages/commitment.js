
import { generateCommitmentNIZKProof, verifyCommitmentNIZKProof } from "../zk-proof/commitmentProof"
import { generatePublicKeyNIZKProof, verifyPublicKeyNIZKProof } from "../zk-proof/publicKeyProof";
import { init_schnorr_group } from "../zk-proof/utils";

import { useState, useEffect } from 'react'
import { bigIntToString } from "./utils";


const commitPrice = async (bid_price, id) => {
    /*
    Compute the commitment of submitted bid and zk-proof, then
    submited to public bulletin.
    ---
    Input
    bid:
    id:
    */
    // decimal to binary
    let bid_price_arr = bid_price.toString(2)
    let bit_idx = 0;
    let proofs = []

    for (const bit of bid_price_arr) {
        let statement = parseInt(bit);
        // TODO: Put groups to global variables
        let [epsilon, epsilon_proof, epsilon_publics] = await generateCommitmentNIZKProof(BigInt(statement), BigInt(id))
        let [pubkey_proof, pubkey_publics] = await generatePublicKeyNIZKProof(BigInt(id))
        const groups = await init_schnorr_group()

        // optional
        verifyCommitmentNIZKProof(epsilon_proof, groups, epsilon_publics)
        verifyPublicKeyNIZKProof(pubkey_proof, groups, pubkey_publics)
        console.log("Success!")
        
        bigIntToString(epsilon)
        bigIntToString(epsilon_proof)
        bigIntToString(epsilon_publics)
        bigIntToString(pubkey_proof)
        bigIntToString(pubkey_publics)

        proofs.push({
            bit_idx,
            epsilon,
            epsilon_proof,
            epsilon_publics,
            pubkey_publics, pubkey_proof,        
        })
        // sendCommitment(epsilon, epsilon_proof, pubkey_publics, pubkey_proof, id, bit_idx)
        bit_idx += 1;
    }
    return proofs
}

export default function Commitment({socket, Id}) {

    const [commitments, setCommitments] = useState([])
    useEffect(() =>{
        socket.on('commitment', message => {
            
            const commitment = JSON.parse(message)
            console.log("Received: ", commitment)
            
            setCommitments((prevCommitment) => {
              const newCommitment = [ ...prevCommitment, commitment ]
            //   newCommitment.push(commitment)
              return newCommitment
            })
        })
    }, [socket])
    

    const sendCommitment = async () => {

        const bid_price = 1783
        // TODO: change to socketio id
        const proofs = await commitPrice(bid_price, Id)
        socket.emit('commitment', JSON.stringify({Id, commitment: proofs}) )
    }
    console.log("Total: ", commitments)
    return (
        <div>
            <input type='button' value='Send commitment' onClick={sendCommitment} />
        </div>
    )
}


/* 
Commitment structure:
[
    {
      id: 3,
      commitment: [
        {
          bit_idx: 1,
          epsilon,
          epsilon_proof,
          epsilon_public,
          pubkey_publics, 
          pubkey_proof,
        },
        {
          bit_idx: 2,
          epsilon,
          epsilon_proof,
          epsilon_public,
          pubkey_publics, 
          pubkey_proof,
        },
      ]
    },
]
*/