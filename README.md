# Implementation of sealed-bid auction without auctioneer 
## Introduction
This repo implements the protocol refered to paper: [SEAL:Sealed-Bid Auction Without Auctioneers](https://ieeexplore.ieee.org/abstract/document/8911493?casa_token=DUR68pzazBQAAAAA:5ZLL8kxoZU5F5zl3ddgQszwLYQmGtuCmY8R0ql740dQctDPFuNHrRQT8DUgqnUb5jtzMzCDcEOk).

This paper proposed a decentralized auction protocol without a central auctioneer. Every bidder compute the highest bid price using [secure multi-party computation](https://en.wikipedia.org/wiki/Secure_multi-party_computation). In short, every bidder cooperate with each other and compute the highest bid price (winner in the auction) among all bidders. After the auction, every bidder only know the highest bid price and learn nothing about other's bid price. 

However, it's a problem that how each bidder communicate with each other? This paper only mentioned there's a secure channel or secure public bulletin in this protocol. Hence, we proposed two implementation for the public bulletin.
## Implementation I
In [implementation I](/impl-1-websocket), we use a traditional centralized web backend server as a public bulletin.

![](/impl-1-websocket/architecture-I.png)
## Implementation II
In [implementation II](/impl-2-smart-contract), we use a blockchain as a public bulletin. In blockchain, everyone has a consensus on the global current state. Every transaction is recorded on chain and backend server code can also run onchain using smart contracts.

![](/impl-2-smart-contract/architecture-II.png)

## How to run?
For detailed operation for these implementation, please refer to [implementation I](/impl-1-websocket) and [implementation II](/impl-2-smart-contract).