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
      const vehicles: Vehicle[] = (await new VehicleRepo().getAllTimeDesc());
  
      const userLocation = {
        latitude: parseFloat(lat as string),
        longitude: parseFloat(lon as string),
      };
  
      // get unique latest values for all the routes
      const vehiclesMap = new Map();
      vehicles.forEach((vehicle) => {
        if (!vehiclesMap.has(vehicle.reg_number)) {
          vehiclesMap.set(vehicle.reg_number, vehicle);
        }
      });
  
      const uniqueVehicles: Vehicle[] = Array.from(vehiclesMap.values());
  
      const closestVehicles = uniqueVehicles
      .map((uniqueVehicle) => ({
        ...uniqueVehicle,
        distance: getDistance(userLocation, {
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
      }[] = (await new VehicleRepo().getAllAvgSpeed());
      
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
}

export default new VehicleController();
