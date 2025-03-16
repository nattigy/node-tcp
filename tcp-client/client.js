// tcp_client.js

const net = require("net");
const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 4000;

app.use(cors());

// Establish TCP connection
const client = new net.Socket();

// List of data types to request
const dataTypes = ["transactions", "logs", "metrics", "events"];

// Store data for each type
const dataStore = {
  transactions: [],
  logs: [],
  metrics: [],
  events: [],
};

client.connect(1337, "localhost", () => {
  console.log("Connected to TCP server");
  requestNextDataType(); // Start the first request
});

const requestNextDataType = async () => {
  for (let i = 0; i < dataTypes.length; i++) {
    if (dataStore[dataTypes[i]].length === 0) {
      client.write(JSON.stringify({ type: dataTypes[i] }).trim());
      await new Promise((resolve) => setTimeout(() => resolve(), 2000));
    }
  }
};

client.on("data", (data) => {
  try {
    console.log("messagedata:", data.toString());
    const message = JSON.parse(data.toString());
    console.log("message:", message);
    // Store the data by type
    if (dataTypes.includes(message.type) && Array.isArray(message.data))
      dataStore[message.type] = [...dataStore[message.type], ...message.data];
  } catch (error) {
    console.error("Error parsing data:", error);
  }
});

client.on("error", (err) => {
  console.error(`Client error: ${err.message}`);
});

client.on("close", () => {
  console.log("Connection closed");
});

// API to serve data to React client
app.get("/api/:type", (req, res) => {
  // const filterOptions = req.query.filter || '{}';
  res.json(
    dataStore[req.params.type] || [{ message: "No data available yet" }]
  );
});

app.listen(PORT, () => {
  console.log(`API server running on http://localhost:${PORT}`);
});
