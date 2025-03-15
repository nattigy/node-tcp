const mongoose = require("mongoose");

const logSchema = new mongoose.Schema({
  message: String,
  level: String,
  timestamp: Date,
});
const Log = mongoose.model("Log", logSchema);

module.exports = Log;
