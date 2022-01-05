const bigIntToString = (arr) => {
  Object.keys(arr).map(function (key) {
    arr[key] = arr[key].toString();
  });
};

export { bigIntToString };
