const mongoose = require("mongoose");

const Metric = mongoose.model(
  "Metric",
  new mongoose.Schema({
    id: String,
    values: [Number],
    metricType: String, // e.g., 'CPU usage', 'memory usage', 'latency'
    timestamp: String,
  })
);

module.exports = Metric;
