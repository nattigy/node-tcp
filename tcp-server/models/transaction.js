const mongoose = require("mongoose");

const Transaction = mongoose.model(
  "Transaction",
  new mongoose.Schema({
    id: String,
    amount: Number,
    timestamp: String,
    status: String, // e.g., 'pending', 'completed', 'failed'
    currency: String,
    alert: String
  })
);

module.exports = Transaction;
