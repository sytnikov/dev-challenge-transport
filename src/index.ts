import express, { Request, Response } from "express";
import { getDistance } from "geolib";

import "./mqttClient";
import pool from "./db";

const app = express();
const port = 3000;

app.get("/", (req: Request, res: Response) => {
  res.send("The Helsinki App Data accepted");
});

app.get("/closest-vehicles", async (req: Request, res: Response) => {
  const { lat, lon } = req.query;

  if (!lat || !lon) {
    return res
      .status(400)
      .json({ error: "Please provide latitude and longitude" });
  }

  try {
    const result = await pool.query(`
      SELECT customer_number, vehicle_number, latitude, longitude, timestamp
      FROM vehicles
      ORDER BY timestamp DESC
    `);

    const vehicles = result.rows;
    const userLocation = {
      latitude: parseFloat(lat as string),
      longitude: parseFloat(lon as string),
    };

    const vehiclesMap = new Map();
    vehicles.forEach((vehicle) => {
      if (!vehiclesMap.has(vehicle.vehicle_number)) {
        vehiclesMap.set(vehicle.vehicle_number, vehicle);
      }
    });

    const uniqueVehicles = Array.from(vehiclesMap.values());

    // need to filter the same vehicle
    const closestVehicles = uniqueVehicles
      .map((vehicle) => ({
        ...vehicle,
        distance: getDistance(userLocation, {
          latitude: parseFloat(vehicle.latitude),
          longitude: parseFloat(vehicle.longitude),
        }),
      }))
      .sort((a, b) => a.distance - b.distance)
      .slice(0, 3);

    res.json(closestVehicles);
  } catch (err) {
    console.error("Failed to fetch vehicles", err);
    res.status(500).json({ error: "Failed to fetch vehicles" });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
