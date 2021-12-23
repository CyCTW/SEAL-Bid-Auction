const pow = (base, exp, m) => {
  if (exp == 0) return 1
  const half = pow(base, (exp/2), m)
  if (exp % 2 == 0) {
    return (half * half) % m
  }
  else {
    return ((half * half % m) * base) % m
  }
}
const randrange = (min, max) => {
  // TODO: Use a secure random number generator
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min);
}
const randomOracle = () => {
  // TODO
  return 5
}

const is_prime = num => {
  for(let i = 2; i < num; i++)
    if(num % i === 0) return false;
  return num > 1;
}

const random_prime = () => {
  return 0
}
export {randomOracle, randrange, pow, is_prime, random_prime}