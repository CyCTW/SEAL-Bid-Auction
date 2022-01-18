import {
  generateCommitmentNIZKProof,
  verifyCommitmentNIZKProof,
} from "../zk-proof/commitmentProof";

import { init_schnorr_group } from "../zk-proof/utils";

import { useState, useEffect } from "react";
<<<<<<< HEAD:impl-1-websocket/frontend/src/components/protocols/commitment.js
import { bigIntToString, stringToBigInt } from "./utils";
import ObjectPage from "../products/ObjectPage";
import AuctionBoard from "../boards/AuctionBoard";
import { verifyPublicKeyNIZKProof } from "../zk-proof/publicKeyProof";
=======
import { bigIntToString } from "./utils";
import { joinAuction, getAuctionContract } from "../../utils";
import ObjectPage from "../ObjectPage";
import AuctionBoard from "../AuctionBoard";
>>>>>>> smart-contract:impl-2-smart-contract/frontend/src/component/stages/commitment.js

const DectoBinary = ({ price, totalBits }) => {
  let bin_val = (price >>> 0).toString(2);
  // TODO padding to some length
  const leng = bin_val.length;
  for (let i = 0; i < totalBits - leng; i++) {
    bin_val = "0" + bin_val;
  }
  return bin_val;
};

const commitPrice = ({ id, bin_price, groups }) => {
  /*
    Compute the commitment of submitted bid and zk-proof, then
    submited to public bulletin.
    ---
    Input
    bid:
    id:
    */
  // decimal to binary
  let bit_idx = 1;
  let proofs = [];
  let commitment_secrets = [];

  for (const bit of bin_price) {
    let statement = parseInt(bit);
    let [epsilon_proof, publickey_proof, epsilon_publics, commitment_secret] =
      generateCommitmentNIZKProof(BigInt(statement), BigInt(id), groups);

    // optional
    verifyCommitmentNIZKProof(epsilon_proof, groups, epsilon_publics);
    console.log("Complete: ", bit_idx);
    proofs.push({
      bit_idx,
      epsilon_proof: bigIntToString(epsilon_proof),
      publickey_proof: bigIntToString(publickey_proof),
      epsilon_publics: bigIntToString(epsilon_publics),
      groups: bigIntToString(groups),
    });
    commitment_secrets.push({ bit_idx, ...commitment_secret });
    bit_idx += 1;
  }
  return [proofs, commitment_secrets];
};

export default function Commitment({
  id,
  numOfParticipants,
  roundState,
  setRoundState,
  price,
  setPrice,
  binPrice,
  setBinPrice,
  privateCommitment,
  setPrivateCommitment,
  totalBits,
  groups,
  auctionDetail,
  setNumOfParticipants,
  participantsIds,
  setParticipantsIds,
}) {
  const [isSubmittedCommitment, setIsSubmittedCommitment] = useState(false);

  const [commitments, setCommitments] = useState([]);

  useEffect(() => {
<<<<<<< HEAD:impl-1-websocket/frontend/src/components/protocols/commitment.js
    socket.on("commitment", (message) => {
      const commitment = JSON.parse(message);
      // Verification
      let pass = true;
      for (let commit of commitment.commitment) {
        const verify_commitment_res = verifyCommitmentNIZKProof(
          stringToBigInt(commit.epsilon_proof),
          stringToBigInt(commit.groups),
          stringToBigInt(commit.epsilon_publics)
        );
        const verify_publickey_res = verifyPublicKeyNIZKProof(stringToBigInt(commit.publickey_proof), stringToBigInt(commit.groups), {
          X: BigInt(commit.epsilon_publics.A),
          R: BigInt(commit.epsilon_publics.B),
        });
        if (verify_commitment_res && verify_publickey_res) {
          console.log("Verify succeed!");        
        } else {
          pass = false;
          console.log("Wrong proof.")
          break
        }

      }
      if (pass) {
        setCommitments((prevCommitment) => {
          const newCommitment = [...prevCommitment, commitment];
          //   newCommitment.push(commitment)
          return newCommitment;
        });
        setParticipantsIds((prevIds) => {
          const newIds = [...prevIds, commitment.id];
          return newIds;
        });
        console.log("commitment length 1: ", commitments.length);

        setNumOfParticipants((prev) => {
          return prev + 1;
        });
        console.log("NumofParcipants 1: ", numOfParticipants);
      }
    });
  }, [socket]);
  console.log("NumofParcipants 2: ", numOfParticipants);
  console.log("commitment length 2: ", commitments.length);

  // useEffect(() => {
  //   if (commitments.length === numOfParticipants) {
  //     // Finish all commitments
  //     setIsSubmittedCommitment(false);
  //     setRoundState(1);
  //   }
  // }, [commitments]);
  console.log("detail", auctionDetail);
=======
    let auctionContract = getAuctionContract(auctionDetail['id']);
    auctionContract.events.JoinAuctionEvent((err, event) => {
      const commitment = JSON.parse(event.returnValues[1]);
      console.log(commitment);

      setCommitments((prevCommitment) => {
        const newCommitment = [...prevCommitment, commitment];
        //   newCommitment.push(commitment)

        return newCommitment;
      });
      setParticipantsIds((prevIds) => {
        const newIds = [...prevIds, commitment.id];
        return newIds;
      });
      console.log("commitment length 1: ", commitments.length)

      // setNumOfParticipants((prev) => {return prev+1});
      // console.log("NumofParcipants 1: ", numOfParticipants)
    })
  }, [auctionDetail]);
  // console.log("NumofParcipants 2: ", numOfParticipants)
  // console.log("commitment length 2: ", commitments.length)

  useEffect(() => {
    if (commitments.length === numOfParticipants) {
      // Finish all commitments
      setIsSubmittedCommitment(false);
      setRoundState(1);
    }
  }, [commitments]);
  // console.log("detail", auctionDetail);
>>>>>>> smart-contract:impl-2-smart-contract/frontend/src/component/stages/commitment.js

  const calculateTimeLeft = () => {
    // calculate difference
    // console.log("expire: ", auctionDetail);
    // console.log("expire: ", typeof auctionDetail.expired_date);
    const difference = auctionDetail.expired_date - new Date();
    // const difference = 5000
    let timeLeft = {};
    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }
    // if (timeLeft.seconds < 10) {
    //   return {};
    // }
    return timeLeft;
  };

  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  // console.log(timeLeft);
  // console.log(timeLeft.days);
  useEffect(() => {
    if (auctionDetail) {
      const timer = setTimeout(() => {
        setTimeLeft(calculateTimeLeft());
      }, 1000);
      // console.log("timeleft: ", timeLeft);
      if (Object.keys(timeLeft).length === 0) {
        clearTimeout(timer);
        setRoundState(1);
      }
    }
  }, [timeLeft, auctionDetail]);
  const sendCommitment = () => {
    const bin_price = DectoBinary({ price, totalBits });
    setBinPrice(bin_price);

    // TODO: change to socketio id
    const [proofs, commitment_secrets] = commitPrice({
      id,
      bin_price,
      groups,
    });

    console.log(proofs, commitment_secrets)
    setPrivateCommitment([...commitment_secrets]);
    joinAuction(auctionDetail['id'], proofs);
    // setPrivateKeys({...privateKeys, ...secrets})
    // socket.emit("commitment", JSON.stringify({ id, commitment: proofs }));
    setIsSubmittedCommitment(true);
  };

  const viewCommitment = () => {
    setIsSubmittedCommitment(true);
  };

  return (
    <div>
      {roundState === 0 ? (
        !isSubmittedCommitment ? (
          <div>
            {auctionDetail && timeLeft && (
              <div>
                <ObjectPage
                  sendCommitment={sendCommitment}
                  viewCommitment={viewCommitment}
                  setPrice={setPrice}
                  isSubmittedCommitment={isSubmittedCommitment}
                  timeLeft={timeLeft}
                  auctionDetail={auctionDetail}
                />
              </div>
            )}
          </div>
        ) : (
          <AuctionBoard
            binPrice={binPrice}
            // currentBinPrice={null}
            // sendProofs={sendPubkeys}
            isSubmitted={isSubmittedCommitment}
            participantsIds={participantsIds}
            proofs={commitments}
            // iter={iter}
            id={id}
            round={0}
            timeLeft={timeLeft}
          />
        )
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
    id: int,
    commitment: [
      {
        bit_idx: int,
        epsilon_proof: {
          commitment_11: BigInt,
          commitment_12: BigInt,
          commitment_21: BigInt,
          commitment_21: BigInt,
          challange_1: BigInt,
          challange_2: BigInt,
          response_1: BigInt,
          response_2: BigInt,
        },
        epsilon_publics: {
          A: BigInt,
          B: BigInt,
          L: BigInt
        },
      },
      {
        bit_idx: int,
        epsilon,
        epsilon_proof,
        epsilon_publics,
      },
    ]
  },
]
*/
