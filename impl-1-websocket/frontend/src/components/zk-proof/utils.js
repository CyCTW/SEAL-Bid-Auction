var forge = require("node-forge");
// const isPrime = require("prime-number");
class group_parameters {
  constructor(g, q, p) {
    this.g = g;
    this.p = p;
    this.q = q;
  }
}

const pow = (base, exp, m) => {
  // deal with negative exponent
  if (exp < 0n) {
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
  // [min, max)
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

  while (old_s < 0n) {
    old_s += b;
  }
  return old_s;
};

const randomOracle = (...args) => {
  let message = "";
  for (let i = 0; i < args.length; i++) {
    message = message.concat(args[i]);
  }
  var md = forge.md.sha256.create();
  md.update(message);
  const digest = md.digest().toHex();
  return BigInt("0x" + digest);
};

const random_prime = (bits) => {
  // var bits = 128;
  return new Promise((resolve, reject) => {
    forge.prime.generateProbablePrime(bits, function (err, num) {
      resolve(BigInt(num));
    });
  });
};

const init_schnorr_group = async () => {
  // Temporary use a valid (q,r,p) pair
  const q = 44054757584985812519348867988622285501n;
  const r = 26952303768783423571564322206900570116n;
  const p =
    5145502063699177093454710178259127921091715285626684965595631083932239806201n;
  const h =
    653219150466924647793780487640641701902051287698290240683401509111697752952n;
  const g =
    2247381610195599257003531654104927070502769275382448717372496680665253704287n;

  return {g, q, p};
};

const findPrivateCommitment = (privateCommitment, iter) => {
  for (let commit of privateCommitment) {
    if (commit.bit_idx == iter) {
      return [BigInt(commit.a), BigInt(commit.b)];
    }
  }
  return [-1n, -1n];
};

const findPrivateKeys = (privateKeys, iter) => {
  for (let privateKey of privateKeys) {
    if (privateKey.iter == iter) {
      return [BigInt(privateKey.x), BigInt(privateKey.r)];
    }
  }
  return [-1n, -1n];
};

const findPublicKeys = (publicKeys, id, iter) => {
  for (let publicKey of publicKeys) {
    if (publicKey.id === id && publicKey.iter === iter) {
      return [
        BigInt(publicKey.pubkey_publics.X),
        BigInt(publicKey.pubkey_publics.R),
      ];
    }
  }
  return [-1n, -1n];
};

const checkDiscreteLog = (X, x, groups) => {
  // const groups = await init_schnorr_group();
  return pow(groups.g, x, groups.p) === X;
};

const compute_schnorr = (pubKeys, iter, id, p) => {
  let ans = 1n;
  for (let pubKey of pubKeys) {
    if (pubKey.iter == iter) {
      if (pubKey.id < id) {
        ans *= BigInt(pubKey.pubkey_publics.X);
        ans = ans % p;
      } else if (pubKey.id > id) {
        // * A^-1
        ans *= egcd(BigInt(pubKey.pubkey_publics.X), p);
        ans = ans % p;
      }
    }
  }
  return ans;
};

export {
  pow,
  randrange,
  egcd,
  randomOracle,
  init_schnorr_group,
  findPrivateKeys,
  findPrivateCommitment,
  findPublicKeys,
  compute_schnorr,
  checkDiscreteLog,
};
