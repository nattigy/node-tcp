const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({ data: String, timestamp: Date, alert: String });
const Transaction = mongoose.model('Transaction', transactionSchema);

module.exports = Transaction