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
  privateKeys,
  decidingBits,
}) => {
  /*
    Compute the roundTwo of zk-proof, then
    submited to public bulletin.
    ---
    Input
    round:
    id:
    */
  const groups_ = await init_schnorr_group();

  let statement = 0;
  let d_bit = 0;
  if (isJunction) {
    let lastDecidingBit = 0;

    for (let decidingBit of decidingBits) {
      if (decidingBit.iter === lastDecidingIter) {
        lastDecidingBit = decidingBit.d_bit;
      }
    }

    if (bit === 1 && lastDecidingBit === 1) {
      d_bit = 1;
      statement = 0;
    } else if (bit === 0 && lastDecidingBit === 1) {
      d_bit = 0;
      statement = 1;
    } else {
      d_bit = 0;
      statement = 2;
    }

    const [B, B_proof, B_publics, groups] = await generateStageTwoNIZKProof({
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
    B = B.toString();
    bigIntToString(B_publics);
    bigIntToString(B_proof);
    bigIntToString(groups);
    return [{ B, B_publics, B_proof, iter, id, groups }, d_bit];
  } else {
    d_bit = bit;
    statement = bit;
    const [B, B_proof, B_publics, groups] = await generateStageOneNIZKProof({
      statement: BigInt(statement),
      id: BigInt(id),
      pubKeys,
      iter,
      privateCommitment,
      privateKeys,
    });
    // Optional
    verifyStageOneNZIKProof(B_proof, groups_, B_publics);

    B = B.toString();
    bigIntToString(B_publics);
    bigIntToString(B_proof);
    bigIntToString(groups);
    return [{ B, B_publics, B_proof, iter, id, groups }, d_bit];
  }
};

const computeCurrentBitPrice = (roundTwoProofs, iter) => {
  let T = 1n;
  for (let roundTwoProof of roundTwoProofs) {
    if (roundTwoProof.iter == iter) {
      T *= BigInt(roundTwoProof.B);
      T %= BigInt(roundTwoProof.groups.p);
    }
  }
  return T === 1n ? 0 : 1;
};

export default function RoundTwo({
  socket,
  id,
  pubKeys,
  numOfParticipants,
  iter,
  setIter,
  lastDecidingIter,
  setLastDecidingIter,
  roundState,
  setRoundState,
  binPrice,
  currentBinPrice,
  setCurrentBinPrice,
  privateCommitment,
  privateKeys,
  isJunction,
  setIsJunction,
  decidingBits,
  setDecidingBits,
  totalBits,
}) {
  const [roundTwoProofs, setRoundTwoProofs] = useState([]);
  const [isSubmittedRoundTwo, setIsSubmittedRoundTwo] = useState(false);

  useEffect(() => {
    socket.on("round2", (message) => {
      const roundTwoProof = JSON.parse(message);
      setRoundTwoProofs((prevRoundTwoProofs) => {
        const newProofs = [...prevRoundTwoProofs, roundTwoProof];

        return newProofs;
      });
    });
  }, [socket]);
  useEffect(() => {
    if (roundTwoProofs.length === iter * numOfParticipants) {
      // Finish one iteration
      const bit = computeCurrentBitPrice(roundTwoProofs, iter);

      setCurrentBinPrice(currentBinPrice + bit.toString());
      if (bit === 1) {
        // Store the last deciding bit position
        setLastDecidingIter(iter);
        setIsJunction(true);
      }
      setIsSubmittedRoundTwo(false);
      setIter(iter + 1);
      if (iter >= totalBits) {
        // Auction end...
        setRoundState(4);
      } else {
        setRoundState(1);
      }
    }
  }, [roundTwoProofs]);

  const sendRoundTwoProof = async () => {
    // TODO: change to socketio id
    const bit = parseInt(binPrice[iter - 1]);
    const [roundTwoProof, d_bit] = await execRoundTwo({
      iter,
      id,
      bit,
      isJunction,
      pubKeys,
      lastDecidingIter,
      privateCommitment,
      privateKeys,
      decidingBits,
      setDecidingBits,
    });
    socket.emit("round2", JSON.stringify(roundTwoProof));
    setDecidingBits([...decidingBits, { iter, d_bit }]);
    setIsSubmittedRoundTwo(true);
  };
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
      ) : isJunction ? (
        <div>Enter junction</div>
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
        iter: int,
        id: int,
        B: BigInt,
        B_publics: {
          A: BigInt,
          B: BigInt,
          X: BigInt,
          R: BigInt,
          Y: BigInt,
          L: BigInt,
          M: BigInt
        }, 
        B_proof: {
          commitment_11: BigInt,
          commitment_12: BigInt,
          ...
          challange_1: BigInt,
          challange_2: BigInt,
          ...
          response_11: BigInt,
          response_12: BigInt,
        },
        groups: {
          g: BigInt,
          p: BigInt,
          q: BigInt,
        }
    }, 
]
*/
