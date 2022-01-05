import {
  egcd,
  pow,
  randrange,
  randomOracle,
  init_schnorr_group,
} from "./utils.js";

class publicKeyNIZKProof {
  constructor(
    cmt_x = 0n,
    cmt_r = 0n,
    ch_x = 0n,
    ch_r = 0n,
    r_x = 0n,
    r_r = 0n
  ) {
    this.commitment_x = cmt_x;
    this.commitment_r = cmt_r;
    this.challange_x = ch_x;
    this.challange_r = ch_r;
    this.response_x = r_x;
    this.response_r = r_r;
  }
}

class private_keys {
  constructor(x, r) {
    this.x = x;
    this.r = r;
  }
}

class public_keys {
  constructor(X, R) {
    this.X = X;
    this.R = R;
  }
}

const verifyPublicKeyNIZKProof = (proof, groups, publics) => {
  /*
    Verify the knowledge of private key
    ----
    Input:
        proof: proof
        groups: group parameters
        publics: public parameters
    Output:
        result: verified result
    */
  const { g, q, p } = groups;
  const { X, R } = publics;

  const verify_x = () => {
    const left = pow(g, proof.response_x, p);
    const right = (proof.commitment_x * pow(X, -proof.challange_x, p)) % p;
    console.log("Verify x...");
    return left === right;
  };
  const verify_r = () => {
    const left = pow(g, proof.response_r, p);
    const right = (proof.commitment_r * pow(R, -proof.challange_r, p)) % p;
    console.log("Verify r...");
    return left === right;
  };
  return verify_x() && verify_r();
};

const init = async () => {
  const groups = await init_schnorr_group();
  const { g, q, p } = groups;

  const x = randrange(1n, q);
  const r = randrange(1n, q);

  const X = pow(g, x, p);
  const R = pow(g, r, p);

  const secrets = new private_keys(x, r);
  const publics = new public_keys(X, R);

  return [groups, secrets, publics];
};

const generatePublicKeyNIZKProof = async (id) => {
  /*
      Generate proof of knowledge of private key
      ----
      Input: 
          statement: Which statement to proof (1 or 2)
          id: 
  
      Output:
          proof: NIZK proof
          groups: groups parameters
          publics: public parameters
    */
  const [groups, secrets, publics] = await init();
  const proof = new publicKeyNIZKProof();
  const { g, q, p } = groups;
  const { x, r } = secrets;
  const { X, R } = publics;

  const r1 = randrange(1n, q);
  const r2 = randrange(1n, q);

  proof.commitment_x = pow(g, r1, p);
  proof.commitment_r = pow(g, r2, p);

  const ch_x = randomOracle(g, proof.commitment_x, X, id);
  const ch_r = randomOracle(g, proof.commitment_r, R, id);
  proof.response_x = r1 - ch_x * x;
  proof.response_r = r2 - ch_r * r;
  proof.challange_x = ch_x;
  proof.challange_r = ch_r;

  return [proof, publics, secrets];
};

export { generatePublicKeyNIZKProof, verifyPublicKeyNIZKProof };
