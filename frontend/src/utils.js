import axios from "axios";

const hostname = "http://localhost:3001";
const path = "api/auctions";

export const getAuctions = async () => {
  //   const headers = {
  //     Accept: "application/json",
  //     "Content-Type": "application/json"
  //   };
  const response = await axios.get(`${hostname}/${path}`);

  return response;
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
