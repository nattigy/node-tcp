const net = require('net');
const mongoose = require("mongoose");
const Transaction = require("./models/transaction");
const Log = require("./models/log");
const Metric = require("./models/metric");
const Event = require("./models/event");

// Connect to MongoDB
// const connection = "mongodb://localhost:27017/transactionsDB"
// const connection = "mongodb://localhost:27017,localhost:27018,localhost:27019/transactionsDB?replicaSet=rs&retryWrites=false"
const connection = "mongodb+srv://nattigy:uWnWPD4PNDSmUJSE@cluster0.ifqtm.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0" 
mongoose.connect(connection, { useNewUrlParser: true, useUnifiedTopology: true });

// Store connected clients
const clients = [];

const models = {
  transactions: Transaction,
  logs: Log,
  metrics: Metric,
  events: Event
}

const modules = ["transactions", "logs", "metrics", "events"]

const server = net.createServer((socket) => {
  console.log('Client connected');
  clients.push(socket);

  socket.on('data', async (data) => {
    const request = data.toString().trim();
    try {
      console.log("Request:", request)
      const parsedRequest = JSON.parse(request);
      console.log("parsedRequest:", parsedRequest)
      if (modules.includes(parsedRequest.type)) {
        const data = (await models[parsedRequest.type].find(parsedRequest.filter || {}).limit(100)) || [];
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
    console.log("isArray: ", Array.isArray(change.fullDocument))
    console.log("Number of clients: ", clients.length)
    clients.forEach((client) => {
      client.write(JSON.stringify({ type, data: [change.fullDocument] }));
    });
  });
};

watchCollections(Transaction, 'transactions');
watchCollections(Log, 'logs');
watchCollections(Metric, 'metrics');
watchCollections(Event, 'events');

server.listen(5000, () => {
  console.log('TCP server listening on port 1337');
});
