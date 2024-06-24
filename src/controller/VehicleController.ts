import { Request, Response } from "express";

import { VehicleService } from "../application/VehicleService";
import { VehicleType } from "../types/VehicleType";

export class VehicleController {
  private vehicleService: VehicleService;

  constructor(vehicleService: VehicleService) {
    this.vehicleService = vehicleService;
  }

  async getAllVehicles(req: Request, res: Response) {
    try {
      const vehicles: VehicleType[] = await this.vehicleService.getVehicles();
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
      // decide on the type
      const closestVehicles = await this.vehicleService.getClosestVehicles(req, res);
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

  async getVehiclesAvgSpeed(req: Request, res: Response) {
    try {
      const vehiclesAvegareSpeed = await this.vehicleService.getVehiclesAvgSpeed();
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

  async getClosestMetroMaxSpeed(req: Request, res: Response) {
    try {
      const closestMetroMaxSpeed = await this.vehicleService.getClosestMetroMaxSpeed();
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
