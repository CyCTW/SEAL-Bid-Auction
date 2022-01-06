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
  return response ;
};

export const updateRemoteProfileData = async (heroId, attrs) => {
  console.log(`Update ${heroId}`);
  const headers = {
    "Content-Type": "application/json"
  };
  const data = await axios.patch(
    `${hostname}/${path}/${heroId}/profile`,
    attrs,
    { headers }
  );
  return data;
};
