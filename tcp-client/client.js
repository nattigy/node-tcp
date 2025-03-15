// tcp_client.js

const net = require('net');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = 4000;

app.use(cors());

// Establish TCP connection
const client = new net.Socket();

// List of data types to request
const dataTypes = ['transactions', 'logs'];
let currentIndex = 0;

// Store data for each type
const dataStore = {};

client.connect(1337, 'localhost', () => {
  console.log('Connected to TCP server');
  requestNextDataType(); // Start the first request
});

const requestNextDataType = () => {
  if (currentIndex < dataTypes.length) {
    const currentType = dataTypes[currentIndex];
    client.write(JSON.stringify({type: currentType}).trim()); // Send the request to the server
  } else {
    // client.end(); // Close connection after fetching all data
    console.log('All data received:', dataStore);
  }
};

client.on('data', (data) => {
  try {
    const message = JSON.parse(data.toString());
    console.log("message:", message)

    // Store the data by type
    dataStore[message.type] = message.data;

    // Move to the next data type
    currentIndex++;
    requestNextDataType(); // Request the next data type
  } catch (error) {
    currentIndex = 0
    console.error('Error parsing data:', error);
  }
});

client.on('error', (err) => {
  console.error(`Client error: ${err.message}`);
});

client.on('close', () => {
  console.log('Connection closed');
});

// API to serve data to React client
app.get('/api/transactions', (req, res) => {
  res.json(dataStore["transactions"] || { message: 'No data available yet' });
});

app.get('/api/logs', (req, res) => {
    res.json(dataStore["logs"] || { message: 'No data available yet' });
  });

app.listen(PORT, () => {
  console.log(`API server running on http://localhost:${PORT}`);
});
