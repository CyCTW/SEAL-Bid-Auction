const { assert } = require("chai")

const Main = artifacts.require("Main")
const Auction = artifacts.require("Auction")
const Bidder = artifacts.require("Bidder")

require("chai")
  .use(require("chai-as-promised"))
  .should()

contract('Main', ([contractOwner, secondAddress, thirdAddress]) => {
  let main, auction;

  // this would attach the deployed smart contract and its methods 
  // to the `main` variable before all other tests are run
  before(async () => {
    main = await Main.deployed()
  })

  // check if deployment goes smooth
  describe('deployment', () => {
    // check if the smart contract is deployed 
    // by checking the address of the smart contract
    it('deploys successfully', async () => {
      const address = await main.address

      assert.notEqual(address, '')
      assert.notEqual(address, undefined)
      assert.notEqual(address, null)
      assert.notEqual(address, 0x0)
    })
  })

  describe('auction', () => {
    it('create a new auction', async () => {
      await main.createAuction('Test Auction', 5, 1, 2, 3, 4, 5, { from: contractOwner });
      const auctions = await main.getAuctions.call();
      auction = await Auction.at(auctions[auctions.length - 1]);

      assert.equal(await auction.auctionName(), "Test Auction");
    })

    it('join auction', async () => {
      let ga = [...Array(32).keys()];
      let gb = [...Array(32).keys()];
      let gp = [...Array(32).keys()];

      await auction.joinAuction(ga, gb, gp, { from: secondAddress });

      const bidderContract = await auction.bidderContractMap(secondAddress);
      const bidder = await Bidder.at(bidderContract);

      assert.equal(await bidder.owner(), secondAddress);
    })
  })
})
