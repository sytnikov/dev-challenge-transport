import express, { Application, Request, Response } from "express";
import { getDistance } from "geolib";

import Database from "./config/database";
import VehicleRouter from "./router/VehicleRouter";

class App {
  public app: Application;

  constructor() {
    this.app = express();
    this.plugins();
    this.databaseSync();
    this.routes();
  }

  protected plugins(): void {
    this.app.use(express.json())
    this.app.use(express.urlencoded({ extended: true}))
    // if added frontend CORS needs to be added
  }

  protected databaseSync(): void {
    const db = new Database();
    db.sequelize?.sync();
  }

  protected routes(): void {
    this.app.route("/").get((req: Request, res: Response) => {
      res.send("Welcome home!")
    })
    this.app.use("/api/v1/vehicles", VehicleRouter)
  }
}


// app.get("/closest-vehicles", async (req: Request, res: Response) => {
//   const { lat, lon } = req.query;

//   if (!lat || !lon) {
//     return res
//       .status(400)
//       .json({ error: "Please provide latitude and longitude" });
//   }

//   try {
//     const result = await pool.query(`
//       SELECT customer_number, vehicle_number, latitude, longitude, timestamp
//       FROM vehicles
//       ORDER BY timestamp DESC
//     `);

//     const vehicles = result.rows;
//     const userLocation = {
//       latitude: parseFloat(lat as string),
//       longitude: parseFloat(lon as string),
//     };

//     const vehiclesMap = new Map();
//     vehicles.forEach((vehicle) => {
//       if (!vehiclesMap.has(vehicle.vehicle_number)) {
//         vehiclesMap.set(vehicle.vehicle_number, vehicle);
//       }
//     });

//     const uniqueVehicles = Array.from(vehiclesMap.values());

//     // need to filter the same vehicle
//     const closestVehicles = uniqueVehicles
//       .map((vehicle) => ({
//         ...vehicle,
//         distance: getDistance(userLocation, {
//           latitude: parseFloat(vehicle.latitude),
//           longitude: parseFloat(vehicle.longitude),
//         }),
//       }))
//       .sort((a, b) => a.distance - b.distance)
//       .slice(0, 3);

//     res.json(closestVehicles);
//   } catch (err) {
//     console.error("Failed to fetch vehicles", err);
//     res.status(500).json({ error: "Failed to fetch vehicles" });
//   }
// });

const app = new App().app 

export default app