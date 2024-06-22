import { Request, Response } from "express";
import { getDistance } from "geolib";

import { VehicleRepo } from "../repository/VehicleRepo";
import { Vehicle } from "../model/Vehicle";

class VehicleController {

  async getAllVehicles(req: Request, res: Response) {
    try {
      const vehicles = await new VehicleRepo().getAll();
      res.status(200).json({
        status: "Ok!",
        message: "All vehicles succesfully fetched",
        data: vehicles,
      });
    } catch (err) {
      res.status(500).json({
        status: "Internal Server Error",
        message: "Internal Server Error",
      });
    }
  }

  async getClosestVehicles(req: Request, res: Response) {
    const { lat, lon } = req.query;

    if (!lat || !lon) {
      return res
        .status(400)
        .json({ error: "Please provide latitude and longitude" });
    }
    try {
      const vehicles: Vehicle[] = await new VehicleRepo().getAllTimeDesc();
  
      const location = {
        latitude: parseFloat(lat as string),
        longitude: parseFloat(lon as string),
      };
  
      // get unique newest values for all the routes
      const newestVehiclesMap = new Map<string, Vehicle>();
      
      for (const vehicle of vehicles) {
        const existingVehicle = newestVehiclesMap.get(vehicle.reg_number)
        if (!existingVehicle || vehicle.timestamp > existingVehicle.timestamp) {
          newestVehiclesMap.set(vehicle.reg_number, vehicle)
        }
      }

      const uniqueVehicles: Vehicle[] = Array.from(newestVehiclesMap.values());
  
      const now = new Date();
      const fiveSecondsFromNow = new Date(now.getTime() - 5000);

      const closestVehicles = uniqueVehicles
      .filter((uniqueVehicle) => {
        const vehicleTime = new Date(uniqueVehicle.timestamp)
        return vehicleTime <= now && vehicleTime >= fiveSecondsFromNow
      })
      .map((uniqueVehicle) => ({
        ...uniqueVehicle,
        distance: getDistance(location, {
          latitude: parseFloat(uniqueVehicle.latitude),
          longitude: parseFloat(uniqueVehicle.longitude),
        }),
      }))
      .sort((a, b) => a.distance - b.distance)
      .slice(0, 3);
      
      res.status(200).json({
        status: "Ok!",
        message: "Closest vehicles fetched",
        data: closestVehicles,
      });
    } catch (err) {
      res.status(500).json({
        status: "Internal Server Error",
        message: "Internal Server Error",
      });
    }
  }

  async getAllAvgSpeed(req: Request, res: Response) {
    try {
      const vehiclesAvegareSpeed: {
        route_number: string,
        average_speed: number,
      }[] = await new VehicleRepo().getAllAvgSpeed();
      
      res.status(200).json({
        status: "Ok!",
        message: "Average speed for all vehicles calculated",
        data: vehiclesAvegareSpeed,
      });
    } catch (err) {
      res.status(500).json({
        status: "Internal Server Error",
        message: "Internal Server Error",
      });
    }
  }

  async getAllMetros(req: Request, res: Response) {
    try {
      const metros = await new VehicleRepo().getAllRoutes(["73N"])
      
      const location = {
        lat: 60.18408281913011,
        lon: 24.96009069614847
      }
      const distanceFromLocation = 400

      const closestMetros = metros
      .map((metro) => ({
        ...metro,
        distance: getDistance(location, {
          latitude: parseFloat(metro.latitude),
          longitude: parseFloat(metro.longitude),
        }),
      }))
      .filter((metro) => metro.distance <= distanceFromLocation)
      
      const closestMetrosMap = new Map();

      closestMetros.forEach((metro) => {
        const { route_number, reg_number, timestamp, speed, distance } = metro;

        if (!closestMetrosMap.has(reg_number)) {
          closestMetrosMap.set(reg_number, {
            route_number,
            reg_number,
            speed,
            timestamp,
            distance
          })
        } else {
          const existingMetro = closestMetrosMap.get(reg_number)
          if (speed > existingMetro.speed) {
            closestMetrosMap.set(reg_number, {
              ...existingMetro,
              speed,
              timestamp,
              distance
            })
          }
        }
      })

      const closestMetroMaxSpeed = Array.from(closestMetrosMap.values())
          .map((metro) => ({
            route: metro.route_number,
            vehicle_number: metro.reg_number,
            v_max: metro.speed,
            milliseconds_ago: Date.now() - new Date(metro.timestamp).getTime(),
            distance: metro.distance
          }))

      res.status(200).json({
        status: "Ok!",
        message: "All metro vehicles with maximum speed near chosen location are fetched",
        data: closestMetroMaxSpeed,
      });
    } catch (err) {
      res.status(500).json({
        status: "Internal Server Error",
        message: "Internal Server Error",
      });
    }
  }
}

export default new VehicleController();
