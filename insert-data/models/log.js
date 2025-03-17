const mongoose = require("mongoose");

const Log = mongoose.model(
  "Log",
  new mongoose.Schema({
    id: String,
    message: String,
    level: String, // e.g., 'info', 'warn', 'error'
    timestamp: String,
    source: String, // e.g., 'server', 'database', 'client'
  })
);

module.exports = Log;
