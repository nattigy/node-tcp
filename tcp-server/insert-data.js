const mongoose = require("mongoose");
const Transaction = require("./models/transaction");
const Log = require("./models/log");

// MongoDB connection
// const connection = "mongodb://localhost:27017/transactionsDB"
const connection = "mongodb://localhost:27017,localhost:27018,localhost:27019/transactionsDB?replicaSet=rs&retryWrites=false"
mongoose.connect(connection, { useNewUrlParser: true, useUnifiedTopology: true });

const insertTransactions = async () => {
  // Sample data to insert
  const sampleData = [
    { amount: 205066, currency: "USD", alert: "High value transaction" },
    {  amount: 20566, currency: "USD", alert: "N" },
    { amount: 50566, currency: "EUR", alert: "Suspicious activity" },
    // { amount: 50566, currency: "EUR", alert: "last" },
  ];

  // Insert data into the database
  Transaction.insertMany(sampleData)
    .then(() => {
      console.log("Data inserted successfully");
      mongoose.connection.close();
    })
    .catch((err) => {
      console.error("Error inserting data:", err);
      mongoose.connection.close();
    });
};

insertTransactions();

const insertLogs = async () => {
  const logs = [
    { message: "User login successful 010", level: "INFO" },
    { message: "Database connection established 010", level: "INFO" },
    {
      message: "Transaction failed due to insufficient balance 010",
      level: "ERROR",
    },
    { message: "Server restarted 010", level: "WARNING" },
    { message: "Unauthorized access attempt detected 010", level: "ALERT" },
    // { message: "last", level: "ALERT" },
  ];

  try {
    await Log.insertMany(logs);
    console.log("Logs inserted successfully");
  } catch (error) {
    console.error("Error inserting logs:", error);
  } finally {
    mongoose.connection.close();
  }
};

insertLogs();
