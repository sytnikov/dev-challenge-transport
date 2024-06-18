import { Request, Response } from "express";

import { VehicleRepo } from "../repository/VehicleRepo";
import { Vehicle } from "../model/Vehicle";

class VehicleController {
  async addVehicle(req: Request, res: Response) {
    try {
      const newVehicle = new Vehicle()
      newVehicle.customer_number = req.body.customer_number;
      newVehicle.reg_number = req.body.reg_number;
      newVehicle.latitude = req.body.latitude;
      newVehicle.longitude = req.body.longitude;

      await new VehicleRepo().createOne(newVehicle)

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
    try {
      const { lan, lon } = req.query;
      console.log('lat and lon:', lan, lon)
      res.status(200).json({
        status: "Ok!",
        message: "Lan and lon fetched",
      })
    } catch (err) {
      res.status(500).json({
        status: "Internal Server Error",
        message: "Internal Server Error",
      });
    }
  }
}

export default new VehicleController();
