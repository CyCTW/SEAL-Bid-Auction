const express = require('express')
const app = express()
const auctions = require('./data.js')


app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

// See overall auctions
app.get('/api/auctions', (req, res) => {
    res.json(auctions)
})

// See auction deatils
app.get('/api/auctions/:auctionID', (req, res) => {
    const id = Number(req.params.auctionID)
    const auction = auctions.find(auction => auction.id === id)
    if (!auction) {
        return res.status(404).send('Product not found')
    }
    res.json(auction)
})
app.use(express.json()) 
// Create auction

var idx = auctions.length

app.post('/api/auctions', (req, res) => {
    console.log("req", req.body)
    const newAuction = {
        id: idx + 1,
        name: req.body.name,
        description: req.body.description,
        expired_date: req.body.expired_date,
        timestamp: new Date()
    }
    idx += 1;
    auctions.push(newAuction)
    res.status(201).json(newAuction)
})

app.delete('/api/auctions/:auctionID', (req, res) => {
    const id = Number(req.params.auctionID)

    for (let idx in auctions) {
        if (auctions[idx].id == id) {
            auctions.splice(idx, 1)
            break
        }
    }
    res.status(200)
})
// Web socket servers

const server = require('http').Server(app)
    .listen(3002,()=>{console.log('open server!')})

// Add Access-header-no-contorol to prevent cros
const io = require('socket.io')(server, {
    cors: {
      origin: '*',
    }
  });

io.on('connection', socket => {

    socket.on('commitment', message => {
        // Return message to all listener
        io.sockets.emit('commitment', message)
    })

    socket.on('round1', message => {
        
        io.sockets.emit('round1', message)
    })

    socket.on('round2', message => {
        
        io.sockets.emit('round2', message)
    })

    socket.on('final', message => {
        
        io.sockets.emit('final', message)
    })

   
})