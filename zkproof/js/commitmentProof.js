// import {randomOracle, randrange, pow, is_prime, random_prime} from 'util.js'

const pow = (base, exp, m) => {
  if (exp == 0n) return 1n
  const half = pow(base, (exp/2), m)
  if (exp % 2n == 0n) {
    return (half * half) % m
  }
  else {
    return ((half * half % m) * base) % m
  }
}
const randrange = (min, max) => {
  // TODO: Use a secure random number generator
  let diff = max - min

  var array = new Uint32Array(20);
  self.crypto.getRandomValues(array);

  let val = BigInt(0)
  for (var i = 0; i < array.length; i++) {
    val = (val << 8) + BigInt(array[i]);
  }
  return val
  
}
const randomOracle = () => {
  // TODO
  return BigInt(328748310893478930174930189403198439343434)
}

const commitmentNIZKProof = (cmt11 = 0n, cmt12 = 0n, cmt21 = 0n, cmt22 = 0n, ch1 = 0n, ch2 = 0n, r1 = 0n, r2 = 0n) => {
    this.commitment_11 = cmt11
    this.commitment_12 = cmt12
    this.commitment_21 = cmt21
    this.commitment_22 = cmt22
    this.challange_1 = ch1
    this.challange_2 = ch2
    this.response_1 = r1
    this.response_2 = r2
  
}

const verifyCommitmentNIZKProof = (proof, g, q, L, A, B) => {
    /* 
    Prove
    Input:
        proof: proof
        generator: g
        module: q
        :L
        :A
        :B
    */
    const verify_1 = () => {
        const left = pow(g, proof.response_1, q)
        const right = proof.commitment_11 / pow(A, proof.challange_1, q)
        return left === right
    }
    const verify_2 = () => {
        const left = pow(B, proof.response_1, q)
        const right = proof.commitment_12 / pow(L, proof.challange_1, q)
        return left === right
    }
    const verify_3 = () => {
        const left = pow(g, proof.response_2, q)
        const right = proof.commitment_21 / pow(A, proof.challange_2, q)
        return left == right
    }
    const verify_4 = () => {
        const left = pow(B, proof.response_2, q)
        const right = proof.commitment_22 / pow(L / g, proof.challange_2, q)
        return left == right
    }
    return verify_1() && verify_2() && verify_3() && verify_4()
}

const generateCommitmentNIZKProof = (statement, g, q, a, b) => {
    /*
    Generate proof of well-formedness of commitment.
    ----
    Input: 
        statement: Which statement to proof (1 or 2)
        g: generator
        a: alpha
        b: beta
        q: module

    Output:
        Proof(challange1, challange2, Response1, Response2)
    */
    const proof = new commitmentNIZKProof()

    if (statement === 0) {
        const r1 = randrange(1n, q)
        const r2 = randrange(1n, q)
        const ch2 = randrange(1n, q)

        proof.commitment_11 = pow(g, r1, q)
        proof.commitment_12 = pow(g, b * r1, q)
        proof.commitment_21 = pow(g, r2, q) * pow(g, a * ch2, q)
        proof.commitment_22 = pow(g, b * r2, q) * pow(g, (a * b - 1) * ch2, q )
        const ch = randomOracle()
        const ch1 = ch - ch2

        proof.challange_1 = ch1
        proof.challange_2 = ch2
        proof.response_1 = r1 - a * ch1
        proof.response_2 = r2
    } 
    return proof
}

const init_schnorr_group = () => {
    // const generate_q_r_p = () => {
    //     const q = random_prime(2**128)
    //     const r = randrange(1, 2**128)
    //     const p = q * r + 1
    //     return [q, r, p]
    // }

    // let [q, r, p] = generate_q_r_p()
    // while (!is_prime(p)) {
    //   [q, r, p] = generate_q_r_p()
    // }
    // let h = randrange(2, p)
    // while (pow(h, r, p) == 1) {
    //   h = randrange(2, p)
    // }

    // const g = pow(h, r, p)
    const q = BigInt(258393462243248066492839594748738579341)
    const r = BigInt(62899182763490337447667364792829983028)
    const p = BigInt(16252737606529100087849781950254135463855596949069201443859132907333861424549)
    const h = BigInt(6281570285727367405194108295402009300483320397540626769118385930123123666911)
    const g = BigInt(6208096989873192183979017114395136128292238284465038123156847208951979729608)

    return [q, r, p, h, g]

}
const statement = 1
const [q, r, p, h, g] = init_schnorr_group()
const alpha = randrange(1n, q)
const beta = randrange(1n, q)
const A = pow(g, alpha, q)
const B = pow(g, beta, q)
const L = pow(g, (alpha * beta + statement), q)
const id = 1

const proof = generateCommitmentNIZKProof(statement, g, q, alpha, beta, id)
const res = verifyCommitmentNIZKProof(proof, g, q, L, A, B)
console.log(res)
