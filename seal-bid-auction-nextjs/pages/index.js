import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import { useState, useEffect } from "react";
import { io, webSocket } from "socket.io-client";

import Commitment from "../components/stages/commitment";
import { init_schnorr_group } from "../components/zk-proof/utils";
import RoundOne from "../components/stages/roundOne";
import RoundTwo from "../components/stages/roundTwo";

export default function Home() {
  const [socket, setSocket] = useState(null);
  const [Id, setId] = useState(0);
  const [pubKeys, setPubKeys] = useState([]);

  const [numOfParticipants, setNumOfParticipants] = useState(2);
  const [price, setPrice] = useState(0);
  const [binPrice, setBinPrice] = useState("");
  const [currentBidPrice, setCurrentBidPrice] = useState("");
  const [lastDecidingIter, setLastDecidingIter] = useState(0)

  // States that control all user's submitting condition
  const [isCommitmentFinish, setIsCommitmentFinish] = useState(false);
  const [roundState, setRoundState] = useState(0);
  const [iter, setIter] = useState(1);

  // Private information
  const [privateKeys, setPrivateKeys] = useState([]);
  const [privateCommitment, setPrivateCommitment] = useState([]);
  /* 
    privateKeys = {
      x, r, a, b
    }
    */

  useEffect(() => {
    //連線成功在 console 中打印訊息
    setSocket(io("http://localhost:3000"));

    console.log("success connect!");
    setId(Math.floor(Math.random() * 100));
  }, [setSocket]);

  console.log("Round state", roundState);
  return (
    <div>
      {socket ? (
        <div>
          {price > 0 && <div>Your price {binPrice}</div>}
          <div>Current price: {currentBidPrice}</div>
          <div>
            <Commitment
              socket={socket}
              Id={Id}
              setIsCommitmentFinish={setIsCommitmentFinish}
              numOfParticipants={numOfParticipants}
              roundState={roundState}
              setRoundState={setRoundState}
              price={price}
              setPrice={setPrice}
              setBinPrice={setBinPrice}
              privateCommitment={privateCommitment}
              setPrivateCommitment={setPrivateCommitment}
            />
          </div>
          <div>
            <RoundOne
              socket={socket}
              Id={Id}
              pubKeys={pubKeys}
              setPubKeys={setPubKeys}
              roundState={roundState}
              setRoundState={setRoundState}
              numOfParticipants={numOfParticipants}
              iter={iter}
              privateKeys={privateKeys}
              setPrivateKeys={setPrivateKeys}
            />
          </div>
          <div>
            <RoundTwo
              socket={socket}
              Id={Id}
              pubKeys={pubKeys}
              roundState={roundState}
              setRoundState={setRoundState}
              numOfParticipants={numOfParticipants}
              iter={iter}
              setIter={setIter}
              binPrice={binPrice}
              currentBidPrice={currentBidPrice}
              setCurrentBidPrice={setCurrentBidPrice}
              privateCommitment={privateCommitment}
              privateKeys={privateKeys}
              lastDecidingIter={lastDecidingIter}
              setLastDecidingIter={setLastDecidingIter}
            />
          </div>
        </div>
      ) : (
        <div>not connected</div>
      )}
    </div>
  );
}
