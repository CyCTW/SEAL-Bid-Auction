import {egcd, pow, randrange, randomOracle, init_schnorr_group} from './utils.js'

class stageOneProof {
    constructor( cmt11 = 0n, cmt12 = 0n, cmt13 = 0n, cmt14 = 0n, 
          cmt21 = 0n, cmt22 = 0n, cmt23 = 0n, cmt24 = 0n, 
          ch1 = 0n, ch2 = 0n, r11 = 0n, r12 = 0n, r21 = 0n, r22 = 0n) {
        this.commitment_11 = cmt11
        this.commitment_12 = cmt12
        this.commitment_13 = cmt13
        this.commitment_14 = cmt14

        this.commitment_21 = cmt21
        this.commitment_22 = cmt22
        this.commitment_23 = cmt23
        this.commitment_24 = cmt24

        this.challange_1 = ch1
        this.challange_2 = ch2

        this.response_11 = r11
        this.response_12 = r12
        this.response_21 = r21
        this.response_22 = r22
    }
}


class private_keys {
    constructor(a, b, x, r) {
        this.a = a
        this.b = b
        this.x = x
        this.r = r
    }
}

class public_keys {
    constructor(A, B, X, R, L, Y, M) {
        this.A = A
        this.B = B
        this.X = X
        this.R = R
        this.L = L
        this.Y = Y
        this.M = M
    }
}

const verifyStageOneNZIKProof = (proof, groups, publics) => {
    /*
    Verify the well-formedness of Stage one submission
    ----
    Input:
        proof: proof
        groups: group parameters
        publics: public parameters
    Output:
        result: verified result
    */
    const {g, q, p} = groups;
    const {A, B, X, R, Y, L, M} = publics;

    const verify_1 = () => {
        const left = pow(g, proof.response_11, p)
        const right = proof.commitment_11 * pow(X, -proof.challange_1, p) % p
        console.log("Verify 1...")
        return left === right
    }
    const verify_2 = () => {
        const left = pow(g, proof.response_12, p)
        const right = proof.commitment_12 * pow(A, -proof.challange_1, p) % p
        console.log("Verify 2...")
        return left === right
    } 
    const verify_3 = () => {
        const left = pow(Y, proof.response_11, p)
        const right = proof.commitment_13 * pow(M, -proof.challange_1, p) % p
        console.log("Verify 3...")
        return left === right
    } 
    const verify_4 = () => {
        const left = pow(B, proof.response_12, p)
        const right = proof.commitment_14 * pow(L, -proof.challange_1, p) % p
        console.log("Verify 4...")
        return left === right
    } 
    const verify_5 = () => {
        const left = pow(g, proof.response_21, p)
        const right = proof.commitment_21 * pow(X, -proof.challange_2, p) % p
        console.log("Verify 5...")
        return left === right
    } 
    const verify_6 = () => {
        const left = pow(g, proof.response_22, p)
        const right = proof.commitment_22 * pow(A, -proof.challange_2, p) % p
        console.log("Verify 6...")
        return left === right
    }  
    const verify_7 = () => {
        const left = pow(R, proof.response_21, p)
        const right = proof.commitment_23 * pow(M, -proof.challange_2, p) % p
        console.log("Verify 7...")
        return left === right
    } 
    const verify_8 = () => {
        const left = pow(B, proof.response_22, p)
        const right = proof.commitment_24 * pow(L * egcd(g, p), -proof.challange_2, p) % p
        console.log("Verify 8...")
        return left === right 
    }
    return verify_1() && verify_2() &&  verify_3() && verify_4() && 
        verify_5() && verify_6() && verify_7() && verify_8()
}

const init = async (statement) => {
    const groups = await init_schnorr_group();
    const {g, q, p} = groups

    const a = randrange(1n, q);
    const b = randrange(1n, q);
    const x = randrange(1n, q); 
    const r = randrange(1n, q); 
    const A = pow(g, a, p);
    const B = pow(g, b, p);
    const L = pow(g, a * b + statement, p);
    const X = pow(g, x, p);
    const R = pow(g, r, p);
    // TODO: Modify Y
    const Y = pow(g, b, p);
    let M = 0n
    if (statement === 0n)
        M = pow(Y, x, p)
    else
        M = pow(R, x, p)

    const secrets = new private_keys(a, b, x, r);
    const publics = new public_keys(A, B, X, R, L, Y, M)
    
    return [groups, secrets, publics];
}

const generateStageOneNIZKProof = async (statement, id) => { 
    /*
      Generate proof of well-formedness of stageone.
      ----
      Input: 
          statement: Which statement to proof (1 or 2)
          id: 
  
      Output:
          proof: NIZK proof
          groups: groups parameters
          publics: public parameters
    */

    const [groups, secrets, publics] = await init(statement);
    const proof = new stageOneProof();

    const {g, q, p} = groups;
    const {a, b, x, r} = secrets;
    const {A, B, X, R, Y, L, M} = publics;

    if (statement === 0n) {
        const r11 = randrange(1n, q)
        const r12 = randrange(1n, q)
        const r21 = randrange(1n, q)
        const r22 = randrange(1n, q)
        const ch2 = randrange(1n, q)

        proof.commitment_11 = pow(g, r11, p)
        proof.commitment_12 = pow(g, r12, p)
        proof.commitment_13 = pow(Y, r11, p)
        proof.commitment_14 = pow(B, r12, p)

        proof.commitment_21 = pow(g, r21, p) * pow(X, ch2, p) % p
        proof.commitment_22 = pow(g, r22, p) * pow(A, ch2, p) % p
        proof.commitment_23 = pow(R, r21, p) * pow(M, ch2, p) % p
        proof.commitment_24 = pow(B, r22, p) * pow(L * egcd(g, p), ch2, p) % p
        const ch = randomOracle(g, A, B, proof.commitment_11, proof.commitment_12, id) 
        const ch1 = ch - ch2

        proof.challange_1 = ch1
        proof.challange_2 = ch2
        proof.response_11 = r11 - x * ch1
        proof.response_12 = r12 - a * ch1
        proof.response_21 = r21
        proof.response_22 = r22
    }
    else if (statement === 1n) {
        const r11 = randrange(1n, q)
        const r12 = randrange(1n, q)
        const r21 = randrange(1n, q)
        const r22 = randrange(1n, q)
        const ch1 = randrange(1n, q)

        proof.commitment_21 = pow(g, r21, p)
        proof.commitment_22 = pow(g, r22, p)
        proof.commitment_23 = pow(R, r21, p)
        proof.commitment_24 = pow(B, r22, p)

        proof.commitment_11 = pow(g, r11, p) * pow(X, ch1, p) % p
        proof.commitment_12 = pow(g, r12, p) * pow(A, ch1, p) % p
        proof.commitment_13 = pow(Y, r11, p) * pow(M, ch1, p) % p
        proof.commitment_14 = pow(B, r12, p) * pow(L, ch1, p) % p
        const ch = randomOracle(g, A, B, proof.commitment_21, proof.commitment_22, id) 
        const ch2 = ch - ch1

        proof.challange_1 = ch1
        proof.challange_2 = ch2
        proof.response_11 = r11 
        proof.response_12 = r12
        proof.response_21 = r21 - x * ch2
        proof.response_22 = r22 - a * ch2
    }
    return [proof, publics];
}

export {generateStageOneNIZKProof, verifyStageOneNZIKProof}