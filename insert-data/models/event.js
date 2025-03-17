const mongoose = require("mongoose");

const Event = mongoose.model(
  "Event",
  new mongoose.Schema({
    id: String,
    eventType: String,
    details: String,
    timestamp: String,
  })
);

module.exports = Event;
