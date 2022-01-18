import { useState, useEffect, useRef } from "react";
import AuctionBoard from "../boards/AuctionBoard";
import {
  checkDiscreteLog,
  findPrivateKeys,
  findPublicKeys,
} from "../zk-proof/utils";
import { sendWinnerClaim, getAuctionContract, logAllEvent } from "../../utils";
import { Button } from "semantic-ui-react";

export default function Final({
  id,
  auctionId,
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
    let auctionContract = getAuctionContract(auctionId);
    auctionContract.events.claimWinnerEvent((err, event) => {
      console.log(event)
      const winner_proof = JSON.parse(event.returnValues[1]);
      setWinnerProof(winner_proof);
    });
  }, []);

  useEffect(() => {
    if (roundState === 4) {
      // Check if win or lose
      if (binPrice === currentBinPrice) {
        setIsWinner(true);
        const [x, r] = findPrivateKeys(privateKeys, lastDecidingIter);
        sendWinnerClaim(auctionId, x)
        // socket.emit("final", JSON.stringify({ id, x: x.toString() }));
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
<<<<<<< HEAD:impl-1-websocket/frontend/src/components/protocols/final.js
=======
          <Button onClick={() => logAllEvent(auctionId)}>Log all</Button>
          <h1>Auction end...</h1>
          {isWinner && isWinner ? (
            <h2> You are the winner!</h2>
          ) : (
            <h2>You loses...</h2>
          )}
>>>>>>> smart-contract:impl-2-smart-contract/frontend/src/component/stages/final.js
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
