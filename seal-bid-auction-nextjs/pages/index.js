import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import { useState, useEffect } from 'react'
import {io, webSocket } from 'socket.io-client'

import {
  generateCommitmentNIZKProof,
  verifyCommitmentNIZKProof,
} from "../components/zk-proof/commitmentProof";
import {
  generateStageOneNIZKProof,
  verifyStageOneNZIKProof,
} from "../components/zk-proof/stageOneProof";
import {
  generateStageTwoNIZKProof,
  verifyStageTwoNZIKProof,
} from "../components/zk-proof/stageTwoProof";
import {
  generatePublicKeyNIZKProof,
  verifyPublicKeyNIZKProof,
} from "../components/zk-proof/publicKeyProof";

import Commitment from "../components/stages/commitment";
import { init_schnorr_group } from "../components/zk-proof/utils";
import RoundOne from "../components/stages/roundOne";
import RoundTwo from "../components/stages/roundTwo";

const runVerification1 = async () => {
  const statements = [0n, 1n];
  const id = 0n;

  for (const statement of statements) {
    const [epsilon, proof, publics] = await generateCommitmentNIZKProof(
      statement,
      id
    );
    const groups = await init_schnorr_group()
    const res = verifyCommitmentNIZKProof(proof, groups, publics);
    console.log("Result: ", res);
  }
};

const runVerification2 = async () => {
  const statements = [0n, 1n];
  const id = 0n;

  for (const statement of statements) {
    const [M, proof, publics] = await generateStageOneNIZKProof(
      statement,
      id
    );
    const groups = await init_schnorr_group()

    const res = verifyStageOneNZIKProof(proof, groups, publics);
    console.log("Result: ", res);
  }
};

const runVerification3 = async () => {
  const statements = [0n, 1n, 2n];
  const id = 0n;

  for (const statement of statements) {
    const [B, proof, publics] = await generateStageTwoNIZKProof(
      statement,
      id
    );
    const groups = await init_schnorr_group()

    const res = verifyStageTwoNZIKProof(proof, groups, publics);
    console.log("Result: ", res);
  }
};

const runVerification_xr = async () => {
  const id = 0n;
  const [proof, groups, publics] = await generatePublicKeyNIZKProof(id);
  const res = verifyPublicKeyNIZKProof(proof, groups, publics);
  console.log("Result: ", res);
};

export default function Home() {
    const [socket, setSocket] = useState(null)
    const [Id, setId] = useState(0)
    
    useEffect(()=>{
        //連線成功在 console 中打印訊息
        setSocket(io('http://localhost:3000'))

        console.log('success connect!')
        setId(Math.floor(Math.random()*100))
    }, [setSocket])

    
    // const sendRoundOne = async () => {
    //     const proofs = await execRoundOne(iter, Id)
    //     socket.emit('round1', JSON.stringify({Id, roundOne: proofs}) )
    // }
    // const sendRoundTwo = async () => {
    //   const proofs = await execRoundTwo(iter, Id)
    //   socket.emit('round2', JSON.stringify({Id: proofs}) )
    // }

    return(
        <div>
          { socket ? ( <div>
              <Commitment socket={socket} Id={Id}/>
              <RoundOne socket={socket} Id={Id}/>
              <RoundTwo socket={socket} Id={Id}/>
            </div>) :
            <div>not connected</div>
          }

            {/* <input type='button' value='Send Roundone' onClick={sendRoundOne} /> */}
            {/* <input type='button' value='Send RoundTwo' onClick={sendRoundTwo} /> */}
            {/* <div>
              <button onClick={runVerification1}>Commitment Proof</button>
              <button onClick={runVerification2}>StageOne Proof</button>
              <button onClick={runVerification3}>StageTwo Proof</button>
              <button onClick={runVerification_xr}>PublicKey Proof</button>
              <button onClick={runVerification_xr}>PublicKey Proof</button>
            </div> */}
        </div>
    )

}
