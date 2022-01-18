import { useState, useEffect, useRef } from "react";
import AuctionBoard from "../boards/AuctionBoard";
import {
  checkDiscreteLog,
  findPrivateKeys,
  findPublicKeys,
} from "../zk-proof/utils";

export default function Final({
  socket,
  id,
  roundState,
  commitment,
  binPrice,
  currentBinPrice,
  lastDecidingIter,
  privateKeys,
  pubKeys,
  groups,
  participantsIds
}) {
  const [isWinner, setIsWinner] = useState(null);
  const [winnerProof, setWinnerProof] = useState(null);

  let pubKeys_ref = useRef(pubKeys);

  const verify = () => {
    // 1. Verify corectness of commitment
    // 2. Verify x in last deciding bit
    const winner_proof = winnerProof;
    const [X, R] = findPublicKeys(pubKeys, winner_proof.id, lastDecidingIter);
    const result = checkDiscreteLog(X, BigInt(winner_proof.x), groups);
    return result;
  };
  useEffect(() => {
    socket.on("final", (message) => {
      const winner_proof = JSON.parse(message);
      setWinnerProof(winner_proof);
    });
  }, [socket]);

  useEffect(() => {
    if (roundState === 4) {
      // Check if win or lose
      if (binPrice === currentBinPrice) {
        setIsWinner(true);
        const [x, r] = findPrivateKeys(privateKeys, lastDecidingIter);
        socket.emit("final", JSON.stringify({ id, x: x.toString() }));
      }
    }
  }, [roundState]);
  return (
    <div>
      {roundState === 4 ? (
        <div>
          <AuctionBoard
            binPrice={binPrice}
            currentBinPrice={currentBinPrice}
            // sendProofs={sendPubkeys}
            isSubmitted={true}
            participantsIds={participantsIds}
            proofs={participantsIds}
            // iter={iter}
            id={id}
            round={3}
            isWinner={isWinner}
          />
        </div>
      ) : (
        <div></div>
      )}
      {winnerProof ? (
        verify() ? (
          <h3>Confirm successful :)</h3>
        ) : (
          <h3>Confirm failed :(</h3>
        )
      ) : (
        <div></div>
      )}
    </div>
  );
}
/*
{
  id: int, 
  x: x,
  commitment: [
    {
      bid_idx: int,
      a: BigInt,
      b: BigInt,
    }
  ]

  
}

*/
