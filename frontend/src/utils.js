import axios from "axios";

import mainContractBuild from "./contracts/Main.json"

// const hostname = "http://localhost:3001";
// const path = "api/auctions";

const mainContractAddress = "0xAaBF09868bF8ad1321bE837A70fD782bc76fc1c0"
const mainContractABI = mainContractBuild['abi']

const web3 = new Web3("ws://localhost:7545");
const mainContract = new web3.eth.Contract(mainContractABI, mainContractAddress);
var account;

export { account, web3, mainContract };

export const getAuctions = async () => {
  let r = await mainContract.methods.getAuctions().call();
  console.log(r);
  //   const headers = {
  //     Accept: "application/json",
  //     "Content-Type": "application/json"
  //   };
  // const response = await axios.get(`${hostname}/${path}`);

  return r;
};


export const getAuction = async (auctionID) => {
  const response = await axios.get(`${hostname}/${path}/${auctionID}`);
  return response;
};

export const addAuction = async (data) => {
  console.log("add", data);
  const res = await axios.post(`${hostname}/${path}`, data);
  return res;
};
