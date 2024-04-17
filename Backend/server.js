const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const app = express();
const port = 3000;

app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/Wathare');
const db = mongoose.connection;

// Define a schema for your data
// const dataSchema = new mongoose.Schema({
//   ts: String,
//   machine_status: Number,
//   vibration: Number,
// });
// const DataModel = mongoose.model('Data', dataSchema);


// API endpoint to filter data based on time range
app.post('/api/filterData', (req, res) => {
  const { startTime, duration, frequency } = req.body;
  let endTime;

  // Calculate end time based on frequency
  switch (frequency) {
    case 'hour':
      endTime = startTime + duration * 3600000;
      break;
    case '8hour': 
      endTime = startTime + duration * 8 * 3600000;
      break;
    case 'day':
      endTime = startTime + duration * 24 * 3600000;
      break;
    case 'week':
      endTime = startTime + duration * 7 * 24 * 3600000;
      break;
    case 'month':
      endTime = startTime + duration * 30 * 24 * 3600000; // Approximation
      break;
    default:
      endTime = startTime + duration * 3600000; // Default to hourly
  }

  // Logic to filter data based on startTime and endTime using MongoDB queries
  DataModel.find({
    ts: { $gte: new Date(startTime), $lte: new Date(endTime) },
  }, (err, data) => {
    if (err) {
      console.log('Error:', err);
      res.status(500).send('Internal Server Error');
    } else {
      res.json(data);
    }
  });
});



const dataSchema = new mongoose.Schema({
  ts: String,
  machine_status: Number,
  vibration: Number,
});


// API endpoint to include location and temperature
app.post('/api/location-temperature', (req, res) => {
  const { ts, machine_status, vibration, location, temperature } = req.body;

  const newData = new Data({
    ts,
    machine_status,
    vibration,
    location,
    temperature,
  });

  newData.save((err, savedData) => {
    if (err) {
      console.error('Error saving location and temperature data:', err);
      return res.status(500).json({ error: 'Error saving data' });
    }
    res.json(savedData);
  });
});


const fetch = require('node-fetch');

app.get('/api/temperature', function(req, res) {
  const { location } = req.query;

  if (!location) {
    return res.status(400).json({ error: 'Location is required' });
  }

  fetch(`https://jsonplaceholder.typicode.com/todos/${location}`)
    .then(function(response) {
      return response.json();
    })
    .then(function(data) {
      const temperature = Math.floor(Math.random() * 100); // Generate a random temperature
      res.json({ location, temperature });
    })
    .catch(function(error) {
      console.error('Error fetching temperature:', error);
      return res.status(500).json({ error: 'Error fetching temperature' });
    });
});



const simulatorInterval = 1000; // Generate data every second

const generateData = async () => {
  const ts = new Date().toISOString();
  const machine_status = Math.floor(Math.random() * 2);
  const vibration = Math.floor(Math.random() * 1000);
  const location = 'sample-location';

  try {
    const temperatureResponse = await fetch(`http://localhost:3000/api/temperature?location=${location}`);
    const temperature = await temperatureResponse.json();

    await fetch(`http://localhost:3000/api/location-temperature`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        ts,
        machine_status,
        vibration,
        location,
        temperature
      })
    });
  } catch (error) {
    console.error('Error generating data:', error);
  }
};

setInterval(generateData, simulatorInterval);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
