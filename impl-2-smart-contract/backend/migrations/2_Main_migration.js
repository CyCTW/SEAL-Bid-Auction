const Main = artifacts.require("Main");
// const Auction = artifacts.require("Auction");

module.exports = function(deployer) {
  deployer.deploy(Main);
};
