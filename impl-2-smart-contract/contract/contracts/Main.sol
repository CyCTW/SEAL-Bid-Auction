// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "@openzeppelin/contracts/access/Ownable.sol";

contract Bidder is Ownable {
    Auction public auctionAddr;
    string public commitment; // JSON

    constructor(
        Auction _auctionAddr,
        string memory _commitment
    ) {
        auctionAddr = _auctionAddr;
        commitment = _commitment;
    }
}

contract Auction {
    address public auctioneer;

    // auction parameters
    string public auctionName;
    string public auctionDesc;
    // uint8 public bitLen = 4;
    address[] public bidders;
    mapping(address => Bidder) public bidderContractMap;

    // group parameters
    uint256 public q;
    uint256 public p;
    uint256 public g;

    event JoinAuctionEvent(address sender, string commitment);
    event Round1Event(address sender, string r1);
    event Round2Event(address sender, string r2);
    event claimWinnerEvent(address sender, string prik);

    uint256 public commitDeadline;

    constructor(
        string memory _auctionName,
        string memory _auctionDesc,
        address _auctioneer,
        uint256 _relCommitDeadlineSec,
        uint256 _q,
        uint256 _p,
        uint256 _g
    ) {
        auctionName = _auctionName;
        auctionDesc = _auctionDesc;
        auctioneer = _auctioneer;
        commitDeadline = block.timestamp + _relCommitDeadlineSec;
        q = _q;
        p = _p;
        g = _g;
    }

    function getBidders() public view returns (address[] memory) {
        return bidders;
    }

    function joinAuction(string memory commitment) public returns (Bidder) {
        require(
            block.timestamp <= commitDeadline,
            "Can't join auction: commit stage is over"
        );
        Bidder newBidder = new Bidder(this, commitment);
        bidderContractMap[msg.sender] = newBidder;
        bidders.push(msg.sender);

        emit JoinAuctionEvent(msg.sender, commitment);

        return newBidder;
    }

    function round1(string memory _r1) public {
        emit Round1Event(msg.sender, _r1);
    }

    function round2(string memory _r2) public {
        emit Round2Event(msg.sender, _r2);
    }

    function claimWinner(string memory _prik) public {
        emit claimWinnerEvent(msg.sender, _prik);
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
        string memory _auctionDesc,
        uint256 _relCommitDeadlineSec,
        uint256 _q,
        uint256 _p,
        uint256 _g
    ) public returns (Auction) {
        require(bytes(_auctionName).length > 0);
        // TODO: check group is valid (require efficient implementation of exponentiation)
        // 1. p = q * r + 1
        // 2. g = h^r mod p
        // 3. g^q = 1 mod p

        Auction newAuction = new Auction(
            _auctionName,
            _auctionDesc,
            msg.sender,
            _relCommitDeadlineSec,
            _q,
            _p,
            _g
        );
        auctions.push(newAuction);

        return newAuction;
    }
}
