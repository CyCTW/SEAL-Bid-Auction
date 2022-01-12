import axios from "axios";
import { init_schnorr_group } from "./component/zk-proof/utils"

import mainContractBuild from "./contracts/Main.json"
import auctionContractBuild from "./contracts/Auction.json"

// const hostname = "http://localhost:3001";
// const path = "api/auctions";

const mainContractAddress = "0x3d508e6ea8AEff06d2c8740Ab12438023d8C5D37";
const mainContractABI = mainContractBuild['abi'];
const auctionContractABI = auctionContractBuild['abi'];

const web3 = new Web3("ws://localhost:7545");
const mainContract = new web3.eth.Contract(mainContractABI, mainContractAddress);
var account;

export { account, web3, mainContract };

export const getAuctions = async () => {
  let r = await mainContract.methods.getAuctions().call();
  return r;
};

export const getAuction = async (auctionAddr) => {
  const auctionContract = new web3.eth.Contract(auctionContractABI, auctionAddr);
  let auctionName = await auctionContract.methods.auctionName().call();
  let auctionDesc = await auctionContract.methods.auctionDesc().call();
  let commitDeadline = await auctionContract.methods.commitDeadline().call();
  let expiredDate = new Date(1000 * commitDeadline)
  return {
    id: auctionAddr,
    name: auctionName,
    desc: auctionDesc,
    expired_date: expiredDate,
  };
};

export const addAuction = async (data) => {
  let auctionName = data['name'];
  let auctionDesc = data['description'];
  let expiredDate = data['expired_date'];
  let relCommitDeadlineSec = Math.floor((expiredDate - Date.now()) / 1000);
  let { g, p, q } = await init_schnorr_group()
  console.log(g, p, q);

  let r = await mainContract.methods.createAuction(
    auctionName, auctionDesc, relCommitDeadlineSec, p, q, g)
    .send({
      'from': web3.eth.defaultAccount,
      'gas': 5000000,
      'gasPrice': 5000000,
    })
  console.log(r);
  // const res = await axios.post(`${hostname}/${path}`, data);
  // return res;
};
