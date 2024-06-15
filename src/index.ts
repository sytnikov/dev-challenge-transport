import express from 'express';
import { getDistance } from 'geolib';

import './mqttClient';
import pool from "./db"

const app = express();
const port = 3000;

pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Failed to connect to the database:', err);
  } else {
    console.log('Database connected successfully at:', res.rows[0].now);
  }
});

app.get('/', (req, res) => {
  res.send('The Helsinki App Data accepted');
});

// Endpoint to get the three closest vehicles
app.get('/closest-vehicles', async (req, res) => {
  const { lat, lon } = req.query;

  if (!lat || !lon) {
    return res.status(400).json({ error: 'Please provide latitude and longitude' });
  }

  try {
    const result = await pool.query(`
      SELECT vehicle_number, latitude, longitude, timestamp
      FROM vehicles
      ORDER BY timestamp DESC
    `);

    const vehicles = result.rows;
    console.log('vehicles:', vehicles)
    const userLocation = { latitude: parseFloat(lat as string), longitude: parseFloat(lon as string) };
    console.log('userLocation:', userLocation)

    const closestVehicles = vehicles
      .map((vehicle) => ({
        ...vehicle,
        distance: getDistance(
          userLocation,
          { latitude: parseFloat(vehicle.latitude), longitude: parseFloat(vehicle.longitude)}
        ),
      }))
      .sort((a, b) => a.distance - b.distance)
      .slice(0, 3);

    res.json(closestVehicles);
  } catch (err) {
    console.error('Failed to fetch vehicles', err);
    res.status(500).json({ error: 'Failed to fetch vehicles' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});