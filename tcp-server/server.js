const net = require('net');
const mongoose = require("mongoose");
const Transaction = require("./models/transaction");
const Log = require("./models/log");

// Connect to MongoDB
// const connection = "mongodb://localhost:27017/transactionsDB"
const connection = "mongodb://localhost:27017,localhost:27018,localhost:27019/transactionsDB?replicaSet=rs&retryWrites=false"
mongoose.connect(connection, { useNewUrlParser: true, useUnifiedTopology: true });

// Store connected clients
const clients = [];

const models = {
  transactions: Transaction,
  logs: Log
}

const server = net.createServer((socket) => {
  console.log('Client connected');
  clients.push(socket);

  socket.on('data', async (data) => {
    const request = data.toString().trim();
    try {
      console.log("Request:", request)
      const parsedRequest = JSON.parse(request);
      console.log("parsedRequest:", parsedRequest)
      if (parsedRequest.type === 'transactions' || parsedRequest.type === 'logs') {
        const data = await models[parsedRequest.type].find(parsedRequest.filter || {}).limit(100);
        socket.write(JSON.stringify({ type: parsedRequest.type, data }));
      } else {
        socket.write(JSON.stringify({ error: 'Invalid request type' }));
      }
    } catch (err) {
      console.error('Invalid request format:', err);
      socket.write(JSON.stringify({ error: 'Invalid request format' }));
    }
  });

  socket.on('end', () => {
    const index = clients.indexOf(socket);
    if (index !== -1) clients.splice(index, 1);
    console.log('Client disconnected');
  });

  socket.on('error', (err) => {
    console.error('TCP Server Error:', err);
  });
});

// MongoDB Change Stream to detect data changes
const watchCollections = async (model, type) => {
  const changeStream = model.watch();
  changeStream.on('change', (change) => {
    console.log(`Change detected in ${type}:`, change);
    clients.forEach((client) => {
      client.write(JSON.stringify({ type, data: Array.isArray(change.fullDocument) ? change.fullDocument : [change.fullDocument] }));
    });
  });
};

watchCollections(Transaction, 'transactions');
watchCollections(Log, 'logs');

server.listen(1337, () => {
  console.log('TCP server listening on port 1337');
});
