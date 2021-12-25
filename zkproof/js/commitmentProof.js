// import {randomOracle, randrange, pow, is_prime, random_prime} from 'util.js'

const pow = (base, exp, m) => {
  // deal with negative exponent
  if (exp < 0) {
    return pow(egcd(base, m), -exp, m);
  }
  if (exp === 0n) {
    return 1n;
  }
  let half = pow(base, exp / 2n, m);
  if (exp % 2n === 0n) {
    return (half * half) % m;
  } else {
    return (((half * half) % m) * base) % m;
  }
};

const randrange = (min, max) => {
  // TODO: Use a secure random number generator
  let diff = max - min;

  var array = new Uint32Array(20);
  self.crypto.getRandomValues(array);

  let val = BigInt(0);
  for (var i = 0; i < array.length; i++) {
    val = (val << 8n) + BigInt(array[i]);
  }
  return (val % diff) + min;
};

const egcd = (a, b) => {
  let s = 0n,
    old_s = 1n;
  let t = 1n,
    old_t = 0n;
  let r = b,
    old_r = a;
  if (b === 0n) {
    return 1;
  }
  while (r !== 0n) {
    let q = BigInt(old_r / r);
    [r, old_r] = [old_r - q * r, r];
    [s, old_s] = [old_s - q * s, s];
    [t, old_t] = [old_t - q * t, t];
  }
  // console.log("Bezout coef: ", old_s.toString(), old_t.toString());
  // console.log("GCD: ", old_r.toString());
  // console.log("Quot by GCD: ", s, t);

  // TODO: 
  // If coef old_s < 0, add large prime p to make it become positive
  // This approach temporary solve the problem. (?)
  if (old_s < 0) {
    return old_s + b
  } else {
    return old_s;
  }
}

const randomOracle = () => {
  // TODO: Add SHA256 random oracle code
  return 41276046190021301260089578926574153588091408971038812136256491021118072847065n;
};

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

const verifyCommitmentNIZKProof = (proof, g, p, L, A, B) => {
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

const generateCommitmentNIZKProof = (statement, g, q, p, a, b, id) => {
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

  const proof = new commitmentNIZKProof();

  if (statement === 0n) {
    const r1 = randrange(1n, q);
    const r2 = randrange(1n, q);
    const ch2 = randrange(1n, q);
    
    proof.commitment_11 = pow(g, r1, p);
    proof.commitment_12 = pow(g, b * r1, p);
    proof.commitment_21 = (pow(g, r2, p) * pow(g, a * ch2, p)) % p;
    proof.commitment_22 =
      (pow(g, b * r2, p) * pow(g, (a * b - 1n) * ch2, p)) % p; // wrong
    const ch = randomOracle();
    const ch1 = ch - ch2;

    proof.challange_1 = ch1;
    proof.challange_2 = ch2;
    proof.response_1 = r1 - a * ch1;
    proof.response_2 = r2;
  }
  return proof;
};

const init_schnorr_group = () => {
  // TODO: Add random prime generation code
  /*
  const generate_q_r_p = () => {
      const q = random_prime(2**128)
      const r = randrange(1, 2**128)
      const p = q * r + 1
      return [q, r, p]
  }

  let [q, r, p] = generate_q_r_p()
  while (!is_prime(p)) {
    [q, r, p] = generate_q_r_p()
  }
  let h = randrange(2, p)
  while (pow(h, r, p) == 1) {
    h = randrange(2, p)
  }

  const g = pow(h, r, p)
  */

  // Temporary use a valid (q,r,p) pair 
  const q = 40300822268012439790266307816395212813n;
  const r = 26952303768783423571564322206900570116n;
  const p = 1086200003899222600948253011498381887830171935499051749186574368982848096309n;
  const h = 653219150466924647793780487640641701902051287698290240683401509111697752952n;
  const g = 943267369195946417894628291488739180537287774708141116943693656138933379742n;

  return [q, r, p, h, g];
};
const statement = 0n;
const [q, r, p, h, g] = init_schnorr_group();
const alpha = randrange(1n, q);
const beta = randrange(1n, q);

const A = pow(g, alpha, p);
const B = pow(g, beta, p);
const L = pow(g, alpha * beta + statement, p);

const id = 1n;

const proof = generateCommitmentNIZKProof(statement, g, q, p, alpha, beta, id);

const res = verifyCommitmentNIZKProof(proof, g, p, L, A, B);
console.log(res);
