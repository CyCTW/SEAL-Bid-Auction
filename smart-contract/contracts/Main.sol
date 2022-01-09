// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "@openzeppelin/contracts/access/Ownable.sol";

// Improve: Use Event&Log to store Bidder information
contract Bidder is Ownable {
    Auction public auctionAddr;
    uint256[] public ga; // commitment (start from MSB)
    uint256[] public gb; // commitment (start from MSB)
    uint256[] public gp; // commitment (start from MSB)
    uint256[] public gx; // round 1 (start from MSB)
    uint256[] public gr; // round 1 (start from MSB)
    uint256[] public b; // round 2 (start from MSB)

    constructor(
        Auction _auctionAddr,
        uint256[] memory _ga,
        uint256[] memory _gb,
        uint256[] memory _gp
    ) {
        auctionAddr = _auctionAddr;
        ga = _ga;
        gb = _gb;
        gp = _gp;
    }

    function round1(uint256 _gx, uint256 _gr) public onlyOwner {
        // TODO: check already submit case
        gx.push(_gx);
        gr.push(_gr);
    }

    function round2(uint256 _b) public onlyOwner {
        // TODO: check already submit case
        b.push(_b);
    }
}

contract Auction {
    address public auctioneer;

    // auction parameters
    string public auctionName;
    uint8 public bitLen = 4;
    address[] public bidders;
    mapping(address => Bidder) public bidderContractMap;

    // group parameters
    uint256 public q;
    uint256 public r;
    uint256 public p;
    uint256 public h;
    uint256 public g;

    // state maintain parameters
    bool public mpcStartFlag = false;
    uint8 public curBit = bitLen - 1;
    uint8 public curRound = 1;
    mapping(uint8 => mapping(uint8 => address[])) public roundBidders;

    event Round1Notification(address sender, uint256 gx, uint256 gr);
    event Round2Notification(address sender, uint256 b);
    event RoundEndNotification(uint8 curBit, uint8 curRound);

    uint256 public commitDeadline;

    constructor(
        string memory _auctionName,
        address _auctioneer,
        uint256 _relCommitDeadlineSec,
        uint256 _q,
        uint256 _r,
        uint256 _p,
        uint256 _h,
        uint256 _g
    ) {
        auctionName = _auctionName;
        auctioneer = _auctioneer;
        commitDeadline = block.timestamp + _relCommitDeadlineSec;
        q = _q;
        r = _r;
        p = _p;
        h = _h;
        g = _g;
    }

    modifier mpcStart() {
        require(
            mpcStartFlag == true ||
                (mpcStartFlag == false && block.timestamp > commitDeadline)
        );

        // start auction
        if (mpcStartFlag == false && block.timestamp > commitDeadline) {
            mpcStartFlag = true;
        }
        _;
    }

    modifier updateState() {
        _;
        roundBidders[curBit][curRound].push(msg.sender);
        // move to next round
        if (roundEnd()) {
            if (curRound == 1) {
                curRound = 2;
            } else if (curRound == 2) {
                curBit--;
                curRound = 1;
            }
            emit RoundEndNotification(curBit, curRound);
        }
    }

    function getBidders() public view returns (address[] memory) {
        return bidders;
    }

    function roundEnd() public view returns (bool) {
        return roundBidders[curBit][curRound].length == bidders.length;
    }

    function joinAuction(
        uint256[] memory _ga,
        uint256[] memory _gb,
        uint256[] memory _gp
    ) public returns (Bidder) {
        require(
            block.timestamp <= commitDeadline,
            "Can't join auction: commit stage is over"
        );
        require(
            _ga.length == bitLen &&
                _gb.length == bitLen &&
                _gp.length == bitLen,
            "Can't join auction: bit length is not matched"
        );

        Bidder newBidder = new Bidder(this, _ga, _gb, _gp);
        bidderContractMap[msg.sender] = newBidder;
        bidders.push(msg.sender);

        return newBidder;
    }

    function round1(uint256 _gx, uint256 _gr) public mpcStart updateState {
        require(curRound == 1, "Not round 1");
        bidderContractMap[msg.sender].round1(_gx, _gr);
        emit Round1Notification(msg.sender, _gx, _gr);
    }

    function round2(uint256 _b) public mpcStart updateState {
        require(curRound == 2, "Not round 2");
        bidderContractMap[msg.sender].round2(_b);
        emit Round2Notification(msg.sender, _b);
    }
}

contract Main {
    address public owner = msg.sender;
    Auction[] public auctions;

    function getAuctions() public view returns (Auction[] memory) {
        return auctions;
    }

    function createAuction(
        string memory _auctionName,
        uint256 _relCommitDeadlineSec,
        uint256 _q,
        uint256 _r,
        uint256 _p,
        uint256 _h,
        uint256 _g
    ) public returns (Auction) {
        require(bytes(_auctionName).length > 0);
        // TODO: check group is valid (require efficient implementation of exponentiation)
        // 1. p = q * r + 1
        // 2. g = h^r mod p
        // 3. g^q = 1 mod p

        Auction newAuction = new Auction(
            _auctionName,
            msg.sender,
            _relCommitDeadlineSec,
            _q,
            _r,
            _p,
            _h,
            _g
        );
        auctions.push(newAuction);

        return newAuction;
    }
}
