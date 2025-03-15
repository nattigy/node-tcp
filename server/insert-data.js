const mongoose = require("mongoose");
const Transaction = require("./models/transaction");
const Log = require("./models/log");

// MongoDB connection
mongoose.connect("mongodb://localhost:27017/transactionsDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const insertTransactions = async () => {
  // Sample data to insert
  const sampleData = [
    {
      data: { amount: 205066, currency: "USD" },
      alert: "High value transaction",
    },
    { data: { amount: 20566, currency: "USD" }, alert: null },
    {
      data: { amount: 50566, currency: "EUR" },
      alert: "Suspicious activity",
    },
  ];

  // Insert data into the database
  Transaction.insertMany(sampleData.map(d => ({...d, data: JSON.stringify(d.data)})))
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
