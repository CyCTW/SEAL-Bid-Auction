# SEAL-Bid-auction - Implementation 1 (NodeJS)

## How to run?
```
docker-compose up --build
```

This command will construct frontend and backend server.

- Frontend default adress: http://localhost:3000
- Backend default adress: http://localhost:3002

## How to operate?
Just open browser and go to http://localhost:3000.

You can create an auction and set the auction name, expired date, etc.

Then, click the auction you created and prepared your bid price.
> *Note: Every bidder must submit their bid price only after all the other bidders are in the same auction page.*

## How to change maximum available bid price?
Go to `frontend/src/env.js` and change `totalBits` variables.

