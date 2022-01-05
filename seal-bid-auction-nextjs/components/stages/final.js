import { useState, useEffect, useRef } from "react";
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
}) {
  const [isWinner, setIsWinner] = useState(null);
  const [winnerProof, setWinnerProof] = useState(null);

  let pubKeys_ref = useRef(pubKeys);

  const verify = async () => {
    // 1. Verify corectness of commitment
    // 2. Verify x in last deciding bit
    const winner_proof = winnerProof;
    const [X, R] = findPublicKeys(pubKeys, winner_proof.id, lastDecidingIter);
    const result = await checkDiscreteLog(X, BigInt(winner_proof.x));
    return result;
  };
  useEffect(() => {
    socket.on("final", async (message) => {
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
          <h1>Auction end...</h1>
          {isWinner && isWinner ? (
            <h2> You are the winner!</h2>
          ) : (
            <h2>You loses...</h2>
          )}
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
