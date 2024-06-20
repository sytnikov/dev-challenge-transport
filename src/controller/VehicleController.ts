import { Request, Response } from "express";
import { getDistance } from "geolib";

import { VehicleRepo } from "../repository/VehicleRepo";
import { Vehicle } from "../model/Vehicle";

class VehicleController {
  async addVehicle(req: Request, res: Response) {
    try {
      const newVehicle = new Vehicle();
      newVehicle.route_number = req.body.customer_number;
      newVehicle.reg_number = req.body.reg_number;
      newVehicle.latitude = req.body.latitude;
      newVehicle.longitude = req.body.longitude;

      await new VehicleRepo().createOne(newVehicle);

      res.status(201).json({
        status: "Created!",
        message: "A new vehicle created",
      });
    } catch (err) {
      res.status(500).json({
        status: "Internal Server Error",
        message: "Internal Server Error",
      });
    }
  }

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
      const vehicles: Vehicle[] = (await new VehicleRepo().getAll()).map(vehicle => vehicle.dataValues);
  
      const userLocation = {
        latitude: parseFloat(lat as string),
        longitude: parseFloat(lon as string),
      };
  
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
    return
  }
}

export default new VehicleController();
