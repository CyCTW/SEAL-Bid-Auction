import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import { generateCommitmentNIZKProof, verifyCommitmentNIZKProof } from '../components/zk-proof/commitmentProof'
import { generateStageOneNIZKProof, verifyStageOneNZIKProof} from '../components/zk-proof/stageOneProof'
import { generateStageTwoNIZKProof, verifyStageTwoNZIKProof } from '../components/zk-proof/stageTwoProof'
import { generatePublicKeyNIZKProof, verifyPublicKeyNIZKProof } from '../components/zk-proof/publicKeyProof'


const runVerification1 = async () => {
    const statements = [0n, 1n];
    const id = 0n;

    for(const statement of statements) {
        const [proof, groups, publics] = await generateCommitmentNIZKProof(statement, id)
        const res = verifyCommitmentNIZKProof(proof, groups, publics)
        console.log("Result: ", res)
    }
}


const runVerification2 = async () => {
    const statements = [0n, 1n];
    const id = 0n;

    for(const statement of statements) {
        const [proof, groups, publics] = await generateStageOneNIZKProof(statement, id)
        const res = verifyStageOneNZIKProof(proof, groups, publics)
        console.log("Result: ", res)
    }
}

const runVerification3 = async () => {
    const statements = [0n, 1n, 2n];
    const id = 0n;

    for(const statement of statements) {
        const [proof, groups, publics] = await generateStageTwoNIZKProof(statement, id)
        const res = verifyStageTwoNZIKProof(proof, groups, publics)
        console.log("Result: ", res)
    }
}

const runVerification_xr = async () => {
  const id = 0n;
  const [proof, groups, publics] = await generatePublicKeyNIZKProof(id)
  const res = verifyPublicKeyNIZKProof(proof, groups, publics)
  console.log("Result: ", res)
}

export default function Home() {
  return (
    <div>
      <button onClick={runVerification1}>Commitment Proof</button>
      <button onClick={runVerification2}>StageOne Proof</button>
      <button onClick={runVerification3}>StageTwo Proof</button>
      <button onClick={runVerification_xr}>PublicKey Proof</button>
    </div>
  )
}
