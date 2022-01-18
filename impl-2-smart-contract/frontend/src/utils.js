import axios from "axios";
import { init_schnorr_group } from "./component/zk-proof/utils"

import mainContractBuild from "./contracts/Main.json"
import auctionContractBuild from "./contracts/Auction.json"

// const hostname = "http://localhost:3001";
// const path = "api/auctions";

const mainContractAddress = "0xe29943E60e6E07767413040CaBCa3505AE7758Cc";
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
    })
  console.log(r);
  // const res = await axios.post(`${hostname}/${path}`, data);
  // return res;
};

export const getAuctionContract = (auctionAddr) => {
  return new web3.eth.Contract(auctionContractABI, auctionAddr);
}

export const joinAuction = async (auctionAddr, data) => {
  const auctionContract = getAuctionContract(auctionAddr);
  let r = await auctionContract.methods.joinAuction(JSON.stringify({
    id: web3.eth.defaultAccount,
    commitment: data
  }))
    .send({
      'from': web3.eth.defaultAccount,
      'gas': 10000000,
    })

  console.log(r);
}

export const sendRound1 = async (auctionAddr, data) => {
  const auctionContract = getAuctionContract(auctionAddr);
  let r = await auctionContract.methods.round1(JSON.stringify(data))
    .send({
      'from': web3.eth.defaultAccount,
      'gas': 10000000,
    })

  console.log(r);
}

export const sendRound2 = async (auctionAddr, data) => {
  const auctionContract = getAuctionContract(auctionAddr);
  let r = await auctionContract.methods.round2(JSON.stringify(data))
    .send({
      'from': web3.eth.defaultAccount,
      'gas': 10000000,
    })

  console.log(r);
}

export const sendWinnerClaim = async (auctionAddr, x) => {
  console.log(x, x.toString(), JSON.stringify({
    id: web3.eth.defaultAccount,
    x: x.toString()
  }));
  const auctionContract = getAuctionContract(auctionAddr);
  let r = await auctionContract.methods.claimWinner(JSON.stringify({
    id: web3.eth.defaultAccount,
    x: x.toString()
  }))
    .send({
      'from': web3.eth.defaultAccount,
      'gas': 1000000,
    })

  console.log(r);
}

export const logAllEvent = async (auctionAddr) => {
  const auctionContract = getAuctionContract(auctionAddr);
  auctionContract.events.JoinAuctionEvent({
      fromBlock: 0
  }, function(error, event){ console.log("JoinAuctionEvent", event); })
  auctionContract.events.Round1Event({
      fromBlock: 0
  }, function(error, event){ console.log("Round1Event", event); })
  auctionContract.events.Round2Event({
      fromBlock: 0
  }, function(error, event){ console.log("Round2Event", event); })
  auctionContract.events.claimWinnerEvent({
      fromBlock: 0
  }, function(error, event){ console.log("claimWinnerEvent", event); })
}