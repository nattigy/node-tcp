const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
  currency: String,
  alert: String,
  amount: Number,
  timestamp: Date,
});
const Transaction = mongoose.model("Transaction", transactionSchema);

module.exports = Transaction;
