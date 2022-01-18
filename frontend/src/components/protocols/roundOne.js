import {
  generatePublicKeyNIZKProof,
  verifyPublicKeyNIZKProof,
} from "../zk-proof/publicKeyProof";
import { init_schnorr_group } from "../zk-proof/utils";
import { bigIntToString, stringToBigInt } from "./utils";
import { useState, useEffect } from "react";
import AuctionBoard from "../boards/AuctionBoard";

const execRoundOne = ({ iter, id, groups }) => {
  /*
    Compute the stageOne of public key and zk-proof, then
    submited to public bulletin.
    ---
    Input
    round:
    id:
    */
  const [pubkey_proof, pubkey_publics, private_keys] =
    generatePublicKeyNIZKProof(BigInt(id), groups);

  // optional
  verifyPublicKeyNIZKProof(pubkey_proof, groups, pubkey_publics);
  let private_keys_ = { ...private_keys, iter };

  return [
    {
      pubkey_publics: bigIntToString(pubkey_publics),
      pubkey_proof: bigIntToString(pubkey_proof),
      groups: bigIntToString(groups),
      iter,
      id,
    },
    private_keys_,
  ];
};

export default function RoundOne({
  socket,
  id,
  pubKeys,
  setPubKeys,
  numOfParticipants,
  iter,
  roundState,
  setRoundState,
  privateKeys,
  setPrivateKeys,
  groups,
  binPrice,
  currentBinPrice,
  participantsIds,
}) {
  // const [iter, setIter] = useState(1)
  const [isSubmittedRoundOne, setIsSubmittedRoundOne] = useState(false);

  useEffect(() => {
    socket.on("round1", (message) => {
      const pubKey = JSON.parse(message);

      const verify_res = verifyPublicKeyNIZKProof(
        stringToBigInt(pubKey.pubkey_proof),
        stringToBigInt(pubKey.groups),
        stringToBigInt(pubKey.pubkey_publics)
      );
      if (verify_res) {
        setPubKeys((prevPubkeys) => {
          const newPubkeys = [...prevPubkeys, pubKey];
          //   newCommitment.push(commitment)

          return newPubkeys;
        });
      } else {
        console.log("Wrong publickey proof...");
      }
    });
  }, [socket]);

  useEffect(() => {
    if (pubKeys.length !== 0 && pubKeys.length === iter * numOfParticipants) {
      setIsSubmittedRoundOne(false);

      setRoundState(2);
    }
  }, [pubKeys]);

  const sendPubkeys = () => {
    // TODO: change to socketio id
    const [pubkey, privatekey] = execRoundOne({ iter, id, groups });
    setPrivateKeys([...privateKeys, privatekey]);
    socket.emit("round1", JSON.stringify(pubkey));
    setIsSubmittedRoundOne(true);
  };
  return (
    <div>
      {roundState === 1 ? (
        <div>
          <AuctionBoard
            binPrice={binPrice}
            currentBinPrice={currentBinPrice}
            sendProofs={sendPubkeys}
            isSubmitted={isSubmittedRoundOne}
            participantsIds={participantsIds}
            proofs={pubKeys}
            iter={iter}
            id={id}
            round={1}
          />
          {/* {isSubmittedRoundOne ? (
            <div>You have submitted round one... wait for others</div>
          ) : (
            <div>
              <h1> Now is Round 1, iteration: {iter}..... </h1>{" "}
            </div>
          )}
          <input type="button" value="Send roundOne" onClick={sendPubkeys} /> */}
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
        iter: int,
        id: int,
        pubkey_publics: {
          X: BigInt,
          R: BigInt,
        }, 
        pubkey_proof: {
          commitment_x: BigInt;
          commitment_r: BigInt;
          challange_x: BigInt;
          challange_r: BigInt;
          response_x: BigInt;
          response_r: BigInt;
        }
    }, 
    {
        iter: 1,
        id: 4,
        pubkey_publics, 
        pubkey_proof
    }
]
*/
