import {egcd, pow, randrange, randomOracle, init_schnorr_group} from './utils.js'

class commitmentNIZKProof {
    constructor(
      cmt11 = 0n,
      cmt12 = 0n,
      cmt21 = 0n,
      cmt22 = 0n,
      ch1 = 0n,
      ch2 = 0n,
      r1 = 0n,
      r2 = 0n
    ) {
      this.commitment_11 = cmt11;
      this.commitment_12 = cmt12;
      this.commitment_21 = cmt21;
      this.commitment_22 = cmt22;
      this.challange_1 = ch1;
      this.challange_2 = ch2;
      this.response_1 = r1;
      this.response_2 = r2;
    }
}


class private_keys {
    constructor(a, b) {
        this.a = a
        this.b = b
    }
}

class public_keys {
    constructor(A, B, L) {
        this.A = A
        this.B = B
        this.L = L
    }
}

const verifyCommitmentNIZKProof = (proof, groups, publics) => {
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
    const {A, B, L} = publics;
    
    const verify_1 = () => {
      const left = pow(g, proof.response_1, p);
      const right = (proof.commitment_11 * pow(A, -proof.challange_1, p)) % p;
      console.log("Verify 1...");
      return left === right;
    };
  
    const verify_2 = () => {
      const left = pow(B, proof.response_1, p);
      const right = (proof.commitment_12 * pow(L, -proof.challange_1, p)) % p;
      console.log("Verify 2...");
      return left === right;
    };
  
    const verify_3 = () => {
      const left = pow(g, proof.response_2, p);
      const right = (proof.commitment_21 * pow(A, -proof.challange_2, p)) % p;
      console.log("Verify 3...");
      return left === right;
    };
  
    const verify_4 = () => {
      const left = pow(B, proof.response_2, p);
      const right =
        (proof.commitment_22 * pow(L * egcd(g, p), -proof.challange_2, p)) % p;
      console.log("Verify 4...");
      return left === right;
    };
    return verify_1() && verify_2() && verify_3() && verify_4();
};
  

const init = async (statement) => {
    const groups = await init_schnorr_group();
    const {g, q, p} = groups
    const a = randrange(1n, q);
    const b = randrange(1n, q);

    const A = pow(g, a, p);
    const B = pow(g, b, p);
    const L = pow(g, a * b + statement, p);

    // const groups = new group_parameters(g, q, p);
    const secrets = new private_keys(a, b);
    const publics = new public_keys(A, B, L)
    
    return [groups, secrets, publics];
}


const generateCommitmentNIZKProof = async (statement, id) => {
    /*
      Generate proof of well-formedness of commitment.
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
    const proof = new commitmentNIZKProof();
    const {g, q, p} = groups;
    const {a, b} = secrets;
    const {A, B, L} = publics;
    const epsilon = [L, A, B]

    if (statement === 0n) {
        const r1 = randrange(1n, q);
        const r2 = randrange(1n, q);
        const ch2 = randrange(1n, q);
        
        proof.commitment_11 = pow(g, r1, p);
        proof.commitment_12 = pow(g, b * r1, p);
        proof.commitment_21 = pow(g, r2, p) * pow(g, a * ch2, p) % p;
        proof.commitment_22 =
            pow(g, b * r2, p) * pow(g, (a * b - 1n) * ch2, p) % p; // wrong
        const ch = randomOracle(g, A, B, proof.commitment_11, proof.commitment_12, id);
        const ch1 = ch - ch2;
    
        proof.challange_1 = ch1;
        proof.challange_2 = ch2;
        proof.response_1 = r1 - a * ch1;
        proof.response_2 = r2;
    } else if (statement === 1n) {
        const r1 = randrange(1n, q)
        const r2 = randrange(1n, q)
        const ch1 = randrange(1n, q)

        proof.commitment_21 = pow(g, r2, p)
        proof.commitment_22 = pow(B, r2, p)
        proof.commitment_11 = pow(g, r1, p) * pow(A, ch1, p) % p
        proof.commitment_12 = pow(B, r1, p) * pow(L, ch1, p) % p
        const ch = randomOracle(g, A, B, proof.commitment_11, proof.commitment_12, id)
        const ch2 = ch - ch1

        proof.challange_1 = ch1
        proof.challange_2 = ch2
        proof.response_1 = r1
        proof.response_2 = r2 - a * ch2
    }
    return [epsilon, proof, publics];
};

export {generateCommitmentNIZKProof, verifyCommitmentNIZKProof}