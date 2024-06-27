import { Request, Response } from "express";

import { VehicleService } from "../application/VehicleService";
import { VehicleType } from "../types/VehicleType";
import { MetroMaxSpeedType } from "../types/MetroMaxSpeedType";
import { VehicleAvgSpeedType } from "../types/VehicleAvgSpeedType";
import { VehiclePartialType } from "../types/VehiclePartialType";
import { convertToKmH } from "../utils/calculator";

export class VehicleController {
  private vehicleService: VehicleService;

  constructor(vehicleService: VehicleService) {
    this.vehicleService = vehicleService;
  }

  async getAllVehicles(req: Request, res: Response) {
    try {
      const vehicles: VehicleType[] = await this.vehicleService.getVehicles();
      res.status(200).json({
        status: 200,
        message: "All vehicles succesfully fetched",
        data: vehicles,
      });
    } catch (err) {
      res.status(500).json({
        status: 500,
        message: "Internal Server Error",
      });
    }
  }

  async getClosestVehicles(req: Request, res: Response) {
    try {
      const { lat, lon } = req.query;
      if (!lat || !lon) {
        return res.status(400).json({
          status: 400,
          message: "Please provide latitude and longitude",
        });
      }
      const closestVehicles: VehicleType[] =
        await this.vehicleService.getClosestVehicles(req);
      res.status(200).json({
        status: 200,
        message: "Closest vehicles fetched",
        data: closestVehicles,
      });
    } catch (err) {
      res.status(500).json({
        status: 500,
        message: "Internal Server Error",
      });
    }
  }

  async getVehiclesAvgSpeed(req: Request, res: Response) {
    try {
      const vehiclesAvegareSpeed: VehicleAvgSpeedType[] =
        await this.vehicleService.getVehiclesAvgSpeed();
      res.status(200).json({
        status: 200,
        message: "Average speed for all vehicles calculated",
        data: vehiclesAvegareSpeed,
      });
    } catch (err) {
      res.status(500).json({
        status: 500,
        message: "Internal Server Error",
      });
    }
  }

  async getClosestMetroMaxSpeed(req: Request, res: Response) {
    try {
      const closestMetroMaxSpeed: VehiclePartialType[] =
        await this.vehicleService.getClosestMetroMaxSpeed();
      const closestMetroMaxSpeedConverted: MetroMaxSpeedType[] =
        closestMetroMaxSpeed.map((metro) => ({
          route: metro.route_number,
          vehicle_number: metro.reg_number,
          v_max: convertToKmH(metro.speed),
          milliseconds_ago: Date.now() - new Date(metro.timestamp).getTime(),
          distance: metro.distance,
        }));
      res.status(200).json({
        status: 200,
        message:
          "All metro vehicles with maximum speed near chosen location are fetched",
        data: closestMetroMaxSpeedConverted,
      });
    } catch (err) {
      res.status(500).json({
        status: 500,
        message: "Internal Server Error",
      });
    }
  }
}
