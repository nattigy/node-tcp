const mongoose = require("mongoose");
const Transaction = require("./models/transaction");
const Log = require("./models/log");
const Metric = require("./models/metric");
const Event = require("./models/event");

const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 5003;

app.use(cors());

// MongoDB connection
// const connection = "mongodb://localhost:27017/transactionsDB"
// const connection =
//   "mongodb://localhost:27017,localhost:27018,localhost:27019/transactionsDB?replicaSet=rs&retryWrites=false";

const connection = "mongodb+srv://nattigy:uWnWPD4PNDSmUJSE@cluster0.ifqtm.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0" 
mongoose.connect(connection, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const insertTransactions = async () => {
  // amount: Number,
  // status: String, // e.g., 'pending', 'completed', 'failed'
  // currency: String,
  // alert: String
  // Sample data to insert
  const sampleData = [
    {
      amount: 205066,
      status: "pending",
      currency: "USD",
      alert: "High value transaction",
    },
    { amount: 20566, status: "completed", currency: "USD", alert: "N" },
    {
      amount: 50566,
      status: "failed",
      currency: "EUR",
      alert: "Suspicious activity",
    },
  ];

  try {
    for(let i = 0; i < sampleData.length; i++){
      await Transaction.create(sampleData[i])
      await new Promise((resolve) => setTimeout(() => resolve(), 2000))
    }
    // await Transaction.insertMany(sampleData);
    console.log("Transactions inserted successfully");
  } catch (error) {
    console.error("Error inserting Transactions:", error);
  } finally {
    // mongoose.connection.close();
  }
};

const insertLogs = async () => {
  // message: String,
  // level: String, // e.g., 'info', 'warn', 'error'
  // source: String, // e.g., 'server', 'database', 'client'
  const sampleData = [
    { message: "User login successful 010", level: "INFO", source: "server" },
    {
      message: "Database connection established 010",
      level: "INFO",
      source: "database",
    },
    {
      message: "Transaction failed due to insufficient balance 010",
      level: "ERROR",
      source: "client",
    },
    { message: "Server restarted 010", level: "WARNING", source: "database" },
    {
      message: "Unauthorized access attempt detected 010",
      level: "ALERT",
      source: "server",
    },
  ];

  try {
    for(let i = 0; i < sampleData.length; i++){
      await Log.create(sampleData[i])
      await new Promise((resolve) => setTimeout(() => resolve(), 2000))
    }
    // await Log.insertMany(sampleData);
    console.log("Logs inserted successfully");
  } catch (error) {
    console.error("Error inserting logs:", error);
  } finally {
    // mongoose.connection.close();
  }
};

const insertMetrics = async () => {
  // value: Number,
  // metricType: String, // e.g., 'CPU usage', 'memory usage', 'latency'
  const sampleData = [
    { values: [100, 300, 700], metricType: "CPU usage" },
    { values: [200, 400, 600], metricType: "memory usage" },
    { values: [500, 800, 650], metricType: "latency" },
  ];

  try {
    for(let i = 0; i < sampleData.length; i++){
      await Metric.create(sampleData[i])
      await new Promise((resolve) => setTimeout(() => resolve(), 2000))
    }
    // await Metric.insertMany(sampleData);
    console.log("Metrics inserted successfully");
  } catch (error) {
    console.error("Error inserting Metrics:", error);
  } finally {
    // mongoose.connection.close();
  }
};

const insertEvents = async () => {
  // eventType: String,
  // details: String,
  const sampleData = [
    { eventType: "loggedin", details: "successfully logged in" },
  ];

  try {
    for(let i = 0; i < sampleData.length; i++){
      await Event.create(sampleData[i])
      await new Promise((resolve) => setTimeout(() => resolve(), 2000))
    }
    // await Event.insertMany(sampleData);
    console.log("Events inserted successfully");
  } catch (error) {
    console.error("Error inserting Events:", error);
  } finally {
    mongoose.connection.close();
  }
};

(async () => {
  await insertTransactions();
  await insertLogs();
  await insertMetrics();
  await insertEvents();
})()

// API to serve data to React client
app.get("/api/insertdata/:type", async (req, res) => {
  const type = req.params.type
  if(type === "transaction") {
    await insertTransactions();
    res.json({message: "transaction data added successfully"});
  } else if (type === "logs") {
    await insertLogs();
    res.json({message: "logs data added successfully"});
  } else if (type === "metrics") {
    await insertMetrics();
    res.json({message: "metrics data added successfully"});
  } else if (type === "events") {
    await insertEvents();
    res.json({message: "events data added successfully"});
  } else {
    res.json({message: "no data added"});
  }
});

app.listen(PORT, () => {
  console.log(`API server running on http://localhost:${PORT}`);
});
