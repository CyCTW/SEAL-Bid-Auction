import { useState, useEffect } from "react";
import { io, webSocket } from "socket.io-client";

import Commitment from "../component/stages/commitment";
import { init_schnorr_group } from "../component/zk-proof/utils";
import RoundOne from "../component/stages/roundOne";
import RoundTwo from "../component/stages/roundTwo";
import Final from "../component/stages/final";
import { getAuction } from "../utils";
import { useParams } from "react-router-dom/cjs/react-router-dom.min";

export default function Auction() {
  let { auctionId } = useParams();

  const [socket, setSocket] = useState(null);
  const [id, setId] = useState(0);
  const [pubKeys, setPubKeys] = useState([]);

  const [numOfParticipants, setNumOfParticipants] = useState(-1);
  const [participantsIds, setParticipantsIds] = useState([])

  // States about price
  const [price, setPrice] = useState(0);
  const [binPrice, setBinPrice] = useState("");
  const [currentBinPrice, setCurrentBinPrice] = useState("");

  const [lastDecidingIter, setLastDecidingIter] = useState(0);
  const [isJunction, setIsJunction] = useState(false);
  const [groups, setGroups] = useState({})

  // States that control all user's submitting condition
  const [roundState, setRoundState] = useState(0);
  const [iter, setIter] = useState(1);

  // Private information states of user
  const [privateKeys, setPrivateKeys] = useState([]);
  const [privateCommitment, setPrivateCommitment] = useState([]);
  const [decidingBits, setDecidingBits] = useState([]);

  // Total padding bits
  const totalBits = 4;

  /* 
    privateKeys = {
      x, r, a, b
    }
    */

  useEffect(() => {
    //連線成功在 console 中打印訊息
    setSocket(io("http://localhost:3001"));

    console.log("success connect!");
    setId(Math.floor(Math.random() * 100));
  }, [setSocket]);

  useEffect(async () => {
    const groups = await init_schnorr_group()
    setGroups(groups)
    console.log("Set group success!")
  }, [])

  const [auctionDetail, setAuctionDetail] = useState(null)
  useEffect(() => {
    getAuction(auctionId).then(
      ({data}) => {
        console.log("data: ", data)
        setAuctionDetail(data)
      }
    ).catch(err => {
      console.log(err)
    })
  }, [auctionId])

  return (
    <div>
      {socket && auctionDetail ? (
        <div>
          {/* {price > 0 && <div>Your price {binPrice}</div>}
          <div>Current price: {currentBinPrice}</div> */}
          <div>
            <Commitment
              socket={socket}
              id={id}
              numOfParticipants={numOfParticipants}
              roundState={roundState}
              setRoundState={setRoundState}
              price={price}
              setPrice={setPrice}
              setBinPrice={setBinPrice}
              privateCommitment={privateCommitment}
              setPrivateCommitment={setPrivateCommitment}
              totalBits={totalBits}
              groups={groups}
              auctionDetail={auctionDetail}
              setNumOfParticipants={setNumOfParticipants}
              participantsIds={participantsIds}
              setParticipantsIds={setParticipantsIds}
            />
          </div>
          <div>
            <RoundOne
              socket={socket}
              id={id}
              pubKeys={pubKeys}
              setPubKeys={setPubKeys}
              roundState={roundState}
              setRoundState={setRoundState}
              numOfParticipants={numOfParticipants}
              iter={iter}
              privateKeys={privateKeys}
              setPrivateKeys={setPrivateKeys}
              groups={groups}
              binPrice={binPrice}
              currentBinPrice={currentBinPrice}
              participantsIds={participantsIds}
            />
          </div>
          <div>
            <RoundTwo
              socket={socket}
              id={id}
              pubKeys={pubKeys}
              roundState={roundState}
              setRoundState={setRoundState}
              numOfParticipants={numOfParticipants}
              iter={iter}
              setIter={setIter}
              binPrice={binPrice}
              currentBinPrice={currentBinPrice}
              setCurrentBinPrice={setCurrentBinPrice}
              privateCommitment={privateCommitment}
              privateKeys={privateKeys}
              lastDecidingIter={lastDecidingIter}
              setLastDecidingIter={setLastDecidingIter}
              isJunction={isJunction}
              setIsJunction={setIsJunction}
              decidingBits={decidingBits}
              setDecidingBits={setDecidingBits}
              totalBits={totalBits}
              groups={groups}
              participantsIds={participantsIds}
            />
          </div>
          <div>
            <Final
              socket={socket}
              id={id}
              roundState={roundState}
              binPrice={binPrice}
              currentBinPrice={currentBinPrice}
              privateKeys={privateKeys}
              pubKeys={pubKeys}
              lastDecidingIter={lastDecidingIter}
              groups={groups}
            />
          </div>
        </div>
      ) : (
        <div>not connected</div>
      )}
    </div>
  );
}