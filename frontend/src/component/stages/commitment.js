import {
  generateCommitmentNIZKProof,
  verifyCommitmentNIZKProof,
} from "../zk-proof/commitmentProof";

import { init_schnorr_group } from "../zk-proof/utils";

import { useState, useEffect } from "react";
import { bigIntToString } from "./utils";
import ObjectPage from "../ObjectPage";

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
    // TODO: Put groups to global variables
    let [epsilon_proof, epsilon_publics, commitment_secret] =
      generateCommitmentNIZKProof(BigInt(statement), BigInt(id), groups);
    // let [pubkey_proof, pubkey_publics, prikey_secrets] = await generatePublicKeyNIZKProof(BigInt(id))
    // const groups = await init_schnorr_group();

    // optional
    verifyCommitmentNIZKProof(epsilon_proof, groups, epsilon_publics);

    bigIntToString(epsilon_proof);
    bigIntToString(epsilon_publics);

    proofs.push({
      bit_idx,
      epsilon_proof,
      epsilon_publics,
    });
    commitment_secrets.push({ bit_idx, ...commitment_secret });
    bit_idx += 1;
  }
  return [proofs, commitment_secrets];
};

export default function Commitment({
  socket,
  id,
  numOfParticipants,
  roundState,
  setRoundState,
  price,
  setPrice,
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
    socket.on("commitment", (message) => {
      const commitment = JSON.parse(message);

      setCommitments((prevCommitment) => {
        const newCommitment = [...prevCommitment, commitment];
        //   newCommitment.push(commitment)

        return newCommitment;
      });
      setParticipantsIds((prevIds) => {
        const newIds = [...prevIds, commitment.id];
        return newIds;
      });
    });
  }, [socket]);

  useEffect(() => {
    if (commitments.length === numOfParticipants) {
      // Finish all commitments
      setIsSubmittedCommitment(false);
      setRoundState(1);
    }
  }, [commitments]);
  console.log("detrail", auctionDetail);

  const calculateTimeLeft = () => {
    // calculate difference
    console.log("expire: ", auctionDetail);
    console.log("expire: ", typeof auctionDetail.expired_date);
    const difference = new Date(auctionDetail.expired_date) - new Date();
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
    if (timeLeft.seconds < 10) {
      return {};
    }
    return timeLeft;
  };

  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  console.log(timeLeft);
  console.log(timeLeft.days);
  useEffect(() => {
    if (auctionDetail) {
      const timer = setTimeout(() => {
        setTimeLeft(calculateTimeLeft());
      }, 1000);
      console.log("timeleft: ", timeLeft);
      if (Object.keys(timeLeft).length === 0) {
        clearTimeout(timer);
        console.log("hihihihi");
        setNumOfParticipants(commitments.length);
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

    setPrivateCommitment([...commitment_secrets]);
    // setPrivateKeys({...privateKeys, ...secrets})
    socket.emit("commitment", JSON.stringify({ id, commitment: proofs }));
    setIsSubmittedCommitment(true);
  };

  return (
    <div>
      {roundState === 0 ? (
        <div>
          {auctionDetail && (
            <div>
              Remain{" "}
              {`${timeLeft.days}:${timeLeft.hours}:${timeLeft.minutes}:${timeLeft.seconds}`}
            </div>
          )}
          <ObjectPage
            sendCommitment={sendCommitment}
            setPrice={setPrice}
            isSubmittedCommitment={isSubmittedCommitment}
          />
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
        epsilon_public: {
          A: BigInt,
          B: BigInt,
          L: BigInt
        },
      },
      {
        bit_idx: int,
        epsilon,
        epsilon_proof,
        epsilon_public,
      },
    ]
  },
]
*/