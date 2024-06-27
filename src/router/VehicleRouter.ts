import { Request, Response } from "express";

import { VehicleService } from "../application/VehicleService";
import { VehicleController } from "../controller/VehicleController";
import { VehicleRepo } from "../repository/VehicleRepo";
import BaseRouter from "./BaseRouter";

const vehicleRepo = new VehicleRepo();
const vehicleService = new VehicleService(vehicleRepo);

export class VehicleRouter extends BaseRouter {
  private vehicleController: VehicleController;

  constructor() {
    super();
    this.vehicleController = new VehicleController(vehicleService);
  }

  public routes(): void {
    this.router.get("/", (req: Request, res: Response) =>
      this.vehicleController.getAllVehicles(req, res)
    );
    this.router.get("/closest-vehicles", (req: Request, res: Response) =>
      this.vehicleController.getClosestVehicles(req, res)
    );
    this.router.get("/average-speed", (req: Request, res: Response) =>
      this.vehicleController.getVehiclesAvgSpeed(req, res)
    );
    this.router.get("/metro-max-speed", (req: Request, res: Response) =>
      this.vehicleController.getClosestMetroMaxSpeed(req, res)
    );
  }
}
