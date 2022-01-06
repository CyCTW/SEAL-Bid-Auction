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
import AuctionBoard from "../AuctionBoard";

const execRoundTwo = ({
  iter,
  id,
  bit,
  isJunction,
  pubKeys,
  lastDecidingIter,
  privateCommitment,
  privateKeys,
  decidingBits,
  groups,
}) => {
  /*
    Compute the roundTwo of zk-proof, then
    submited to public bulletin.
    ---
    Input
    round:
    id:
    */
  // const groups_ = await init_schnorr_group();
  let statement = 0;
  let d_bit = 0;
  // return [statement, d_bit]

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

    let [B, B_proof, B_publics] = generateStageTwoNIZKProof({
      statement: BigInt(statement),
      id: BigInt(id),
      pubKeys,
      iter,
      lastDecidingIter,
      privateCommitment,
      privateKeys,
      groups,
    });

    // Optional
    verifyStageTwoNZIKProof(B_proof, groups, B_publics);
    B = B.toString();
    bigIntToString(B_publics);
    bigIntToString(B_proof);
    let roundTwoProof = { B, B_publics, B_proof, iter, id };
    return [roundTwoProof, d_bit];
  } else {
    d_bit = bit;
    statement = bit;
    let [B, B_proof, B_publics] = generateStageOneNIZKProof({
      statement: BigInt(statement),
      id: BigInt(id),
      pubKeys,
      iter,
      privateCommitment,
      privateKeys,
      groups,
    });
    // Optional
    verifyStageOneNZIKProof(B_proof, groups, B_publics);

    B = B.toString();
    bigIntToString(B_publics);
    bigIntToString(B_proof);

    let roundTwoProof = { B, B_publics, B_proof, iter, id };
    return [roundTwoProof, d_bit];
  }
};

const computeCurrentBitPrice = ({ roundTwoProofs, iter, groups }) => {
  let T = 1n;
  for (let roundTwoProof of roundTwoProofs) {
    if (roundTwoProof.iter == iter) {
      T *= BigInt(roundTwoProof.B);
      T %= BigInt(groups.p);
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
  groups,
  participantsIds,
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
      const bit = computeCurrentBitPrice({ roundTwoProofs, iter, groups });

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
  }, [roundTwoProofs, groups]);

  const sendRoundTwoProof = () => {
    // TODO: change to socketio id
    const bit = parseInt(binPrice[iter - 1]);
    let [roundTwoProof, d_bit] = execRoundTwo({
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
      groups
    });
    socket.emit("round2", JSON.stringify(roundTwoProof));
    setDecidingBits([...decidingBits, { iter, d_bit }]);
    setIsSubmittedRoundTwo(true);
  };
  return (
    <div>
      {roundState === 2 ? (
        <div>
          <AuctionBoard
            binPrice={binPrice}
            currentBinPrice={currentBinPrice}
            sendProofs={sendRoundTwoProof}
            isSubmitted={isSubmittedRoundTwo}
            participantsIds={participantsIds}
            proofs={roundTwoProofs}
            iter={iter}
            id={id}
          />
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
