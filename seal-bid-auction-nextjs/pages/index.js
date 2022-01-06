import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import { useState, useEffect } from "react";
import { io, webSocket } from "socket.io-client";

import Commitment from "../components/stages/commitment";
import { init_schnorr_group } from "../components/zk-proof/utils";
import RoundOne from "../components/stages/roundOne";
import RoundTwo from "../components/stages/roundTwo";
import final from "../components/stages/final";
import Final from "../components/stages/final";

export default function Home() {
  const [socket, setSocket] = useState(null);
  const [id, setId] = useState(0);
  const [pubKeys, setPubKeys] = useState([]);

  const [numOfParticipants, setNumOfParticipants] = useState(2);

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
    setSocket(io("http://localhost:3000"));

    console.log("success connect!");
    setId(Math.floor(Math.random() * 100));
  }, [setSocket]);

  useEffect(async () => {
    const groups = await init_schnorr_group()
    setGroups(groups)
    console.log("Set group success!")
  }, [])

  return (
    <div>
      {socket ? (
        <div>
          {price > 0 && <div>Your price {binPrice}</div>}
          <div>Current price: {currentBinPrice}</div>
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
