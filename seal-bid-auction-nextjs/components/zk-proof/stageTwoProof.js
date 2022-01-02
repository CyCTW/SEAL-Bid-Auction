import {egcd, pow, randrange, randomOracle, init_schnorr_group} from './utils.js'

class stageTwoProof {
    constructor(cmt11 = 0n, cmt12 = 0n, cmt13 = 0n, cmt11_ = 0n, cmt12_ = 0n, cmt13_ = 0n,
          cmt21 = 0n, cmt22 = 0n, cmt23 = 0n, cmt21_ = 0n, cmt22_ = 0n, cmt23_ = 0n,
          cmt31 = 0n, cmt32 = 0n, cmt33 = 0n, cmt31_ = 0n, cmt32_ = 0n, cmt33_ = 0n,
          ch1 = 0n, ch2 = 0n, ch3 = 0n, r11 = 0n, r12 = 0n, r13 = 0n, r21 = 0n, r22 = 0n, r23 = 0n, r31 = 0n, r32 = 0n) {
        this.commitment_11 = cmt11
        this.commitment_12 = cmt12
        this.commitment_13 = cmt13
        
        this.commitment_11_ = cmt11_
        this.commitment_12_ = cmt12_
        this.commitment_13_ = cmt13_

        this.commitment_21 = cmt21
        this.commitment_22 = cmt22
        this.commitment_23 = cmt23

        this.commitment_21_ = cmt21_
        this.commitment_22_ = cmt22_
        this.commitment_23_ = cmt23_

        this.commitment_31 = cmt31
        this.commitment_32 = cmt32
        this.commitment_33 = cmt33

        this.commitment_31_ = cmt31_
        this.commitment_32_ = cmt32_
        this.commitment_33_ = cmt33_

        this.challange_1 = ch1
        this.challange_2 = ch2
        this.challange_3 = ch3

        this.response_11 = r11
        this.response_12 = r12
        this.response_13 = r13
        this.response_21 = r21
        this.response_22 = r22
        this.response_23 = r23
        this.response_31 = r31
        this.response_32 = r32
    }
}



class private_keys {
    constructor(a, b, x, r, x_, r_) {
        this.a = a
        this.b = b
        this.x = x
        this.x_ = x_
        this.r = r
        this.r_ = r_
    }
}

class public_keys {
    constructor(A, B, X, R, X_, R_, L, Y, Y_, M, M_) {
        this.A = A
        this.B = B
        this.X = X
        this.X_ = X_
        this.R = R
        this.R_ = R_
        this.L = L
        this.Y = Y
        this.Y_ = Y_
        this.M = M
        this.M_ = M_
    }
}

const verifyStageTwoNZIKProof = (proof, groups, publics ) => {
    /*
    Verify the well-formedness of Stage two submission
    ----
    Input:
        proof: proof
        groups: group parameters
        publics: public parameters
    Output:
        result: verified result
    */
    const {g, q, p} = groups;
    const {L, A, B, M, X, Y, R, M_, X_, Y_, R_} = publics;

    const verify_1 = ()=> {
        const left = pow(g, proof.response_11, p)
        const right = proof.commitment_11 * pow(X, -proof.challange_1, p) % p
        console.log("Verify 1...")
        return left === right
    }
    const verify_2 = () => {
        const left = pow(g, proof.response_12, p)
        const right = proof.commitment_12 * pow(X_, -proof.challange_1, p) % p
        console.log("Verify 2...")
        return left === right 
    }
    const verify_3 = () => {
        const left = pow(g, proof.response_13, p)
        const right = proof.commitment_13 * pow(A, -proof.challange_1, p) % p
        console.log("Verify 3...")
        return left === right 
    }
    const verify_4 = () => {
        const left = pow(R, proof.response_11, p)
        const right = proof.commitment_11_ * pow(M, -proof.challange_1, p) % p
        console.log("Verify 4...")
        return left === right 
    }
    const verify_5 = () => {
        const left = pow(R_, proof.response_12, p)
        const right = proof.commitment_12_ * pow(M_, -proof.challange_1, p) % p
        console.log("Verify 5...")
        return left === right 
    }

    const verify_6 = () => {
        const left = pow(B, proof.response_13, p)
        const right = proof.commitment_13_ * pow(L * egcd(g, p), -proof.challange_1, p) % p
        console.log("Verify 6...")
        return left === right  
    }
    const verify_7 = () => {
        const left = pow(g, proof.response_21, p)
        const right = proof.commitment_21 * pow(X, -proof.challange_2, p) % p
        console.log("Verify 7...")
        return left === right 
    }
    const verify_8 = () => {
        const left = pow(g, proof.response_22, p)
        const right = proof.commitment_22 * pow(X_, -proof.challange_2, p) % p
        console.log("Verify 8...")
        return left === right 
    }
    const verify_9 = () => {
        const left = pow(g, proof.response_23, p)
        const right = proof.commitment_23 * pow(A, -proof.challange_2, p) % p
        console.log("Verify 9...")
        return left === right
    }
    const verify_10 = () => {
        const left = pow(Y, proof.response_21, p)
        const right = proof.commitment_21_ * pow(M, -proof.challange_2, p) % p
        console.log("Verify 10...")
        return left === right 
    }
    const verify_11 = () => {
        const left = pow(R_, proof.response_22, p)
        const right = proof.commitment_22_ * pow(M_, -proof.challange_2, p) % p
        console.log("Verify 11...")
        return left === right 
    }
    const verify_12 = () => {
        const left = pow(B, proof.response_23, p)
        const right = proof.commitment_23_ * pow(L, -proof.challange_2, p) % p
        console.log("Verify 12...")
        return left === right 
    }
    const verify_13 = () => {
        const left = pow(g, proof.response_31, p)
        const right = proof.commitment_31 * pow(X, -proof.challange_3, p) % p
        console.log("Verify 13...")
        return left === right 
    }
    const verify_14 = () => {
        const left = pow(g, proof.response_32, p)
        const right = proof.commitment_32 * pow(X_, -proof.challange_3, p) % p
        console.log("Verify 14...")
        return left === right  
    }
    const verify_15 = () => {
        const left = pow(Y, proof.response_31, p)
        const right = proof.commitment_31_ * pow(M, -proof.challange_3, p) % p
        console.log("Verify 15...")
        return left === right 
    }
    const verify_16 = () => {
        const left = pow(Y_, proof.response_32, p)
        const right = proof.commitment_32_ * pow(M_, -proof.challange_3, p) % p
        console.log("Verify 16...")
        return left === right 
    }
    return verify_1() && verify_2() &&  verify_3() && verify_4() && 
        verify_5() && verify_6() && verify_7() && verify_8() && 
        verify_9() && verify_10() && verify_11() && verify_12() && 
        verify_13() && verify_14() && verify_15() && verify_16()
}

const init = async (statement) => {
    const groups = await init_schnorr_group();
    const {g, q, p} = groups
    
    const a = randrange(1n, q);
    const b = randrange(1n, q);
    const x = randrange(1n, q); 
    const r = randrange(1n, q); 
    const x_ = randrange(1n, q); 
    const r_ = randrange(1n, q);

    const A = pow(g, a, p);
    const B = pow(g, b, p);
    const X = pow(g, x, p);
    const R = pow(g, r, p);
    
    const X_ = pow(g, x_, p)
    const R_ = pow(g, r_, p)
    // TODO: Modify Y
    const Y = pow(g, b, p);
    const Y_ = pow(g, b, p);
    let L = 0n, M = 0n, M_ = 0n

         
    if (statement === 0n) {
        M = pow(R, x, p)
        M_ = pow(R_, x_, p)
        L = pow(g, (a * b + 1n), p) 
    }
    else if (statement === 1n) {
        M = pow(Y, x, p)
        M_ = pow(R_, x_, p)
        L = pow(g, (a * b), p) 
    }
    else if (statement === 2n) {
        M = pow(Y, x, p)
        M_ = pow(Y_, x_, p)
        L = pow(g, (a * b), p) 
    }

    // const groups = new group_parameters(g, q, p);
    const secrets = new private_keys(a, b, x, r, x_, r_);
    const publics = new public_keys(A, B, X, R, X_, R_, L, Y, Y_, M, M_)
    return [groups, secrets, publics];
}
    
const generateStageTwoNIZKProof = async (statement, id)=> {
    /*
      Generate proof of well-formedness of stagetwo.
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
    
    const proof = new stageTwoProof()

    const {g, q, p} = groups;
    const {a, b, x, r, x_, r_} = secrets;
    const {A, B, X, R, X_, R_, L, Y, Y_, M, M_} = publics;

    if (statement === 0n){
        const r11 = randrange(1n, q)
        const r12 = randrange(1n, q)
        const r13 = randrange(1n, q)
        const r21 = randrange(1n, q)
        const r22 = randrange(1n, q)
        const r23 = randrange(1n, q)
        const r31 = randrange(1n, q)
        const r32 = randrange(1n, q)
        const ch2 = randrange(1n, q)
        const ch3 = randrange(1n, q)

        proof.commitment_11 = pow(g, r11, p) 
        proof.commitment_12 = pow(g, r12, p)
        proof.commitment_13 = pow(g, r13, p)
        proof.commitment_11_ = pow(R, r11, p)
        proof.commitment_12_ = pow(R_, r12, p)
        proof.commitment_13_ = pow(B, r13, p)

        proof.commitment_21 = pow(g, r21, p) * pow(X, ch2, p) % p
        proof.commitment_22 = pow(g, r22, p) * pow(X_, ch2, p) % p
        proof.commitment_23 = pow(g, r23, p) * pow(A, ch2, p) % p
        proof.commitment_21_ = pow(Y, r21, p) * pow(M, ch2, p) % p
        proof.commitment_22_ = pow(R_, r22, p) * pow(M_, ch2, p) % p
        proof.commitment_23_ = pow(B, r23, p) * pow(L, ch2, p) % p

        proof.commitment_31 = pow(g, r31, p) * pow(X, ch3, p) % p
        proof.commitment_32 = pow(g, r32, p) * pow(X_, ch3, p) % p
        proof.commitment_31_ = pow(Y, r31, p) * pow(M, ch3, p) % p
        proof.commitment_32_ = pow(Y_, r32, p) * pow(M_, ch3, p) % p

        const ch = randomOracle(g, A, B, proof.commitment_11, proof.commitment_12, id) 
        const ch1 = ch - ch2 - ch3

        proof.challange_1 = ch1
        proof.challange_2 = ch2
        proof.challange_3 = ch3
        proof.response_11 = r11 - x * ch1
        proof.response_12 = r12 - x_ * ch1
        proof.response_13 = r13 - a * ch1
        proof.response_21 = r21
        proof.response_22 = r22
        proof.response_23 = r23
        proof.response_31 = r31
        proof.response_32 = r32
    }
    else if (statement === 1n) {
        const r11 = randrange(1n, q)
        const r12 = randrange(1n, q)
        const r13 = randrange(1n, q)
        const r21 = randrange(1n, q)
        const r22 = randrange(1n, q)
        const r23 = randrange(1n, q)
        const r31 = randrange(1n, q)
        const r32 = randrange(1n, q)
        const ch1 = randrange(1n, q)
        const ch3 = randrange(1n, q)

        proof.commitment_21 = pow(g, r21, p)
        proof.commitment_22 = pow(g, r22, p)
        proof.commitment_23 = pow(g, r23, p)
        proof.commitment_21_ = pow(Y, r21, p)
        proof.commitment_22_ = pow(R_, r22, p)
        proof.commitment_23_ = pow(B, r23, p)

        proof.commitment_11 = pow(g, r11, p) * pow(X, ch1, p) % p
        proof.commitment_12 = pow(g, r12, p) * pow(X_, ch1, p) % p
        proof.commitment_13 = pow(g, r13, p) * pow(A, ch1, p) % p
        proof.commitment_11_ = pow(R, r11, p) * pow(M, ch1, p) % p
        proof.commitment_12_ = pow(R_, r12, p) * pow(M_, ch1, p) % p
        proof.commitment_13_ = pow(B, r13, p) * pow(L * egcd(g, p), ch1, p) % p

        proof.commitment_31 = pow(g, r31, p) * pow(X, ch3, p) % p
        proof.commitment_32 = pow(g, r32, p) * pow(X_, ch3, p) % p
        proof.commitment_31_ = pow(Y, r31, p) * pow(M, ch3, p) % p
        proof.commitment_32_ = pow(Y_, r32, p) * pow(M_, ch3, p) % p

        const ch = randomOracle(g, A, B, proof.commitment_11, proof.commitment_12, id) 
        const ch2 = ch - ch1 - ch3

        proof.challange_1 = ch1
        proof.challange_2 = ch2
        proof.challange_3 = ch3
        proof.response_11 = r11 
        proof.response_12 = r12
        proof.response_13 = r13
        proof.response_21 = r21 - x * ch2
        proof.response_22 = r22 - x_ * ch2
        proof.response_23 = r23 - a * ch2
        proof.response_31 = r31
        proof.response_32 = r32
    }
    else if (statement === 2n) {
        const r11 = randrange(1n, q)
        const r12 = randrange(1n, q)
        const r13 = randrange(1n, q)
        const r21 = randrange(1n, q)
        const r22 = randrange(1n, q)
        const r23 = randrange(1n, q)
        const r31 = randrange(1n, q)
        const r32 = randrange(1n, q)
        const ch1 = randrange(1n, q)
        const ch2 = randrange(1n, q)

        proof.commitment_11 = pow(g, r11, p) * pow(X, ch1, p) % p
        proof.commitment_12 = pow(g, r12, p) * pow(X_, ch1, p) % p
        proof.commitment_13 = pow(g, r13, p) * pow(A, ch1, p) % p
        proof.commitment_11_ = pow(R, r11, p) * pow(M, ch1, p) % p
        proof.commitment_12_ = pow(R_, r12, p) * pow(M_, ch1, p) % p
        proof.commitment_13_ = pow(B, r13, p) * pow(L * egcd(g, p), ch1, p) % p

        proof.commitment_21 = pow(g, r21, p) * pow(X, ch2, p) % p
        proof.commitment_22 = pow(g, r22, p) * pow(X_, ch2, p) % p
        proof.commitment_23 = pow(g, r23, p) * pow(A, ch2, p) % p
        proof.commitment_21_ = pow(Y, r21, p) * pow(M, ch2, p) % p
        proof.commitment_22_ = pow(R_, r22, p) * pow(M_, ch2, p) % p
        proof.commitment_23_ = pow(B, r23, p) * pow(L, ch2, p) % p

        proof.commitment_31 = pow(g, r31, p) 
        proof.commitment_32 = pow(g, r32, p) 
        proof.commitment_31_ = pow(Y, r31, p) 
        proof.commitment_32_ = pow(Y_, r32, p) 

        const ch = randomOracle(g, A, B, proof.commitment_11, proof.commitment_12, id) // H(g || y1 || y2 || r1 || r2 || id)
        const ch3 = ch - ch1 - ch2

        proof.challange_1 = ch1
        proof.challange_2 = ch2
        proof.challange_3 = ch3
        proof.response_11 = r11 
        proof.response_12 = r12
        proof.response_13 = r13
        proof.response_21 = r21 
        proof.response_22 = r22 
        proof.response_23 = r23 
        proof.response_31 = r31 - x * ch3
        proof.response_32 = r32 - x_ * ch3
    }
    return [proof, publics];
}

export {generateStageTwoNIZKProof, verifyStageTwoNZIKProof}