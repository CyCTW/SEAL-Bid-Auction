import {
  generatePublicKeyNIZKProof,
  verifyPublicKeyNIZKProof,
} from "../zk-proof/publicKeyProof";
import { init_schnorr_group } from "../zk-proof/utils";
import {
  generateStageOneNIZKProof,
  verifyStageOneNZIKProof,
} from "../zk-proof/stageOneProof";
import {
  generateStageTwoNIZKProof,
  verifyStageTwoNZIKProof,
} from "../zk-proof/stageTwoProof";
import { bigIntToString } from "./utils";
import { useState, useEffect } from "react";

const execRoundTwo = async ({
  iter,
  id,
  bit,
  isJunction,
  pubKeys,
  lastDecidingIter,
  privateCommitment,
  privateKeys}
) => {
  /*
    Compute the roundTwo of zk-proof, then
    submited to public bulletin.
    ---
    Input
    round:
    id:
    */
  const groups_ = await init_schnorr_group();
  let groups = 0;
  let B = 0;
  let B_proof = {};
  let B_publics = {};
  console.log("Pubkeys: ", pubKeys);
  const statement = bit;
  // TODO: Pass Yij into function
  if (isJunction) {
    // TODO: Find previous bit and decide statement
    [B, B_proof, B_publics, groups] = await generateStageTwoNIZKProof({
      statement: BigInt(statement),
      id: BigInt(id),
      pubKeys,
      iter,
      lastDecidingIter,
      privateCommitment,
      privateKeys,
    });

    // Optional
    verifyStageTwoNZIKProof(B_proof, groups_, B_publics);
  } else {
    [B, B_proof, B_publics, groups] = await generateStageOneNIZKProof({
      statement: BigInt(statement),
      id: BigInt(id),
      pubKeys,
      iter,
      privateCommitment,
      privateKeys,
    });
    // Optional
    // verifyStageOneNZIKProof(B_proof, groups_, B_publics)
  }
  B = B.toString();
  bigIntToString(B_publics);
  bigIntToString(B_proof);
  bigIntToString(groups);
  return { B, B_publics, B_proof, iter, id, groups };
};

const computeCurrentBitPrice = (roundTwoProofs, iter) => {
  let T = 1n;
  for (let roundTwoProof of roundTwoProofs) {
    if (roundTwoProof.iter == iter) {
      T *= BigInt(roundTwoProof.B);
      T %= BigInt(roundTwoProof.groups.p);
    }
  }
  console.log("T: ", T.toString());
  return T === 1n ? 0 : 1;
};

export default function RoundTwo({
  socket,
  Id,
  pubKeys,
  numOfParticipants,
  iter,
  setIter,
  lastDecidingIter,
  setLastDecidingIter,
  roundState,
  setRoundState,
  binPrice,
  currentBidPrice,
  setCurrentBidPrice,
  privateCommitment,
  privateKeys,
}) {
  const [roundTwoProofs, setRoundTwoProofs] = useState([]);
  const [isJunction, setIsJunction] = useState(false);
  const [isSubmittedRoundTwo, setIsSubmittedRoundTwo] = useState(false);

  useEffect(() => {
    socket.on("round2", (message) => {
      const roundTwoProof = JSON.parse(message);
      console.log("Received: ", roundTwoProof);

      setRoundTwoProofs((prevRoundTwoProofs) => {
        const newProofs = [...prevRoundTwoProofs, roundTwoProof];

        return newProofs;
      });
    });
  }, [socket]);
  useEffect(() => {
    if (roundTwoProofs.length === iter * numOfParticipants) {
      // Finish one iteration
      // TODO: Compute Tij
      const bit = computeCurrentBitPrice(roundTwoProofs, iter);

      setCurrentBidPrice(currentBidPrice + bit.toString());
      if (bit === 1) {
        // Store the last deciding bit position
        setLastDecidingIter(iter)
        setIsJunction(true)
      }
      setIsSubmittedRoundTwo(false);
      setIter(iter + 1);
      setRoundState(1);
    }
  }, [roundTwoProofs]);

  const sendRoundTwoProof = async () => {
    // TODO: change to socketio id
    const bit = binPrice[iter - 1];
    const roundTwoProof = await execRoundTwo({
      iter,
      id: Id,
      bit,
      isJunction,
      pubKeys,
      lastDecidingIter,
      privateCommitment,
      privateKeys}
    );
    socket.emit("round2", JSON.stringify(roundTwoProof));
    setIsSubmittedRoundTwo(true);
  };
  console.log("RoundTwoProofs: ", roundTwoProofs);
  return (
    <div>
      {roundState === 2 ? (
        <div>
          {isSubmittedRoundTwo ? (
            <div>You have submitted round two... wait for others</div>
          ) : (
            <div>
              <h1> Now is Round 2, iteration: {iter}..... </h1>
            </div>
          )}
          <input
            type="button"
            value="Send roundTwo"
            onClick={sendRoundTwoProof}
          />{" "}
        </div>
      ) : (
        <div></div>
      )}
    </div>
  );
}
/* 
pubkeys structure:
[
    { 
        iter: 1,
        id: 3,
        B,
        B_publics, 
        B_proof,
        groups
    }, 
    {
        iter: 1,
        id: 4,
        B,
        B_publics, 
        B_proof,
        groups
    }
]
*/
