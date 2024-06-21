import VehicleController from "../controller/VehicleController";
import BaseRouter from "./BaseRouter";

class VehicleRouter extends BaseRouter {
  public routes(): void {
    this.router.get("", VehicleController.getAllVehicles)
    this.router.get("/closest-vehicles", VehicleController.getClosestVehicles)
    this.router.get("/average-speed", VehicleController.getAllAvgSpeed)
  }
}

export default new VehicleRouter().router