const net = require('net');
const mongoose = require("mongoose");
const Transaction = require("./models/transaction");
const Log = require("./models/log");

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/transactionsDB', { useNewUrlParser: true, useUnifiedTopology: true });

// Store connected clients
const clients = [];

const server = net.createServer((socket) => {
  console.log('Client connected');
  clients.push(socket);

  socket.on('data', (data) => {
    const request = data.toString().trim();
    if (request === 'transactions' || request === 'logs') {
      streamData(socket, request);
    }
  });

  socket.on('end', () => {
    const index = clients.indexOf(socket);
    if (index !== -1) clients.splice(index, 1);
  });
});

function streamData(socket, type) {
  const model = type === 'transactions' ? Transaction : Log;

  // Stream data at intervals
  const interval = setInterval(async () => {
    const data = await model.find({}).sort({ timestamp: -1 }).limit(100).lean();
    console.log("data: ", data)
    const payload = JSON.stringify({ type, data });
    socket.write(payload);
  }, 5000); // Fetch data every 5 seconds

  socket.on('end', () => clearInterval(interval));
}

const PORT = 1337;
server.listen(PORT, () => {
  console.log(`TCP server listening on port ${PORT}`);
});
