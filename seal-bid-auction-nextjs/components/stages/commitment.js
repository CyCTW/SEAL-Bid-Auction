import {
  generateCommitmentNIZKProof,
  verifyCommitmentNIZKProof,
} from "../zk-proof/commitmentProof";
import {
  generatePublicKeyNIZKProof,
  verifyPublicKeyNIZKProof,
} from "../zk-proof/publicKeyProof";
import { init_schnorr_group } from "../zk-proof/utils";

import { useState, useEffect } from "react";
import { bigIntToString } from "./utils";

const DectoBinary = (val) => {
  let bin_val = (val >>> 0).toString(2);
  // TODO padding to some length
  const leng = bin_val.length;
  for (let i = 0; i < 10 - leng; i++) {
    bin_val = "0" + bin_val;
  }
  return bin_val;
};

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
  let bid_price_arr = DectoBinary(bid_price);
  let bit_idx = 1;
  let proofs = [];
  let commitment_secrets = [];

  for (const bit of bid_price_arr) {
    let statement = parseInt(bit);
    // TODO: Put groups to global variables
    let [epsilon, epsilon_proof, epsilon_publics, commitment_secret] =
      await generateCommitmentNIZKProof(BigInt(statement), BigInt(id));
    // let [pubkey_proof, pubkey_publics, prikey_secrets] = await generatePublicKeyNIZKProof(BigInt(id))
    const groups = await init_schnorr_group();

    // optional
    verifyCommitmentNIZKProof(epsilon_proof, groups, epsilon_publics);
    // verifyPublicKeyNIZKProof(pubkey_proof, groups, pubkey_publics)
    console.log("Success!");

    bigIntToString(epsilon);
    bigIntToString(epsilon_proof);
    bigIntToString(epsilon_publics);
    // bigIntToString(pubkey_proof)
    // bigIntToString(pubkey_publics)

    proofs.push({
      bit_idx,
      epsilon,
      epsilon_proof,
      epsilon_publics,
      // pubkey_publics, pubkey_proof,
    });
    commitment_secrets.push({ bit_idx, ...commitment_secret });
    console.log(commitment_secrets);
    // sendCommitment(epsilon, epsilon_proof, pubkey_publics, pubkey_proof, id, bit_idx)
    bit_idx += 1;
  }
  return [proofs, commitment_secrets];
};

export default function Commitment({
  socket,
  Id,
  setIsCommitmentFinish,
  numOfParticipants,
  roundState,
  setRoundState,
  price,
  setPrice,
  setBinPrice,
  privateCommitment,
  setPrivateCommitment,
}) {
  const [isSubmittedCommitment, setIsSubmittedCommitment] = useState(false);

  const [commitments, setCommitments] = useState([]);

  useEffect(() => {
    socket.on("commitment", (message) => {
      const commitment = JSON.parse(message);
      console.log("Received: ", commitment);

      setCommitments((prevCommitment) => {
        const newCommitment = [...prevCommitment, commitment];
        //   newCommitment.push(commitment)

        return newCommitment;
      });
    });
  }, [socket]);

  useEffect(() => {
    if (commitments.length === numOfParticipants) {
      // Finish all commitments
      setIsSubmittedCommitment(false);
      setIsCommitmentFinish(true);
      setRoundState(1);
    }
  }, [commitments]);

  const sendCommitment = async () => {
    const bin_val = DectoBinary(price);
    setBinPrice(bin_val);

    const bid_price = price;
    // TODO: change to socketio id
    const [proofs, commitment_secrets] = await commitPrice(bid_price, Id);

    setPrivateCommitment([...commitment_secrets]);
    // setPrivateKeys({...privateKeys, ...secrets})
    socket.emit("commitment", JSON.stringify({ Id, commitment: proofs }));
    setIsSubmittedCommitment(true);
  };

  console.log("Price", price);
  console.log("Commitments: ", commitments);
  return (
    <div>
      {roundState === 0 ? (
        <div>
          {isSubmittedCommitment ? (
            <div>You have submitted commitment... wait for others</div>
          ) : (
            <div>
              <h1> Now is Commitment... </h1>
            </div>
          )}
          <form>
            <label>
              Price:
              <input
                type="text"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </label>
            <input
              type="button"
              value="Send commitment"
              onClick={sendCommitment}
            />
          </form>
        </div>
      ) : (
        <div></div>
      )}
    </div>
  );
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
