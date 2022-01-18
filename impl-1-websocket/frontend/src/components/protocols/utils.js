const bigIntToString = (arr) => {
  let tmp = {}
  for (let key in arr) {
    tmp[key] = arr[key].toString()
  }
  return tmp
  // Object.keys(arr).map(function (key) {
  //   arr[key] = arr[key].toString();
  // });
};

const stringToBigInt = (arr) => {
  let tmp = {}
  for (let key in arr) {
    tmp[key] = BigInt(arr[key])
  }
  // Object.keys(arr).map(function (key) {
  //   arr[key] = BigInt(arr[key]);
  // });
  return tmp
}
export { bigIntToString, stringToBigInt };
