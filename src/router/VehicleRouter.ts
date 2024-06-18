import VehicleController from "../controller/VehicleController";
import BaseRouter from "./BaseRouter";

class VehicleRouter extends BaseRouter {
  public routes(): void {
    this.router.post("", VehicleController.addVehicle)
    this.router.get("", VehicleController.getAllVehicles)
    this.router.get("/closest-vehicles", VehicleController.getClosestVehicles)
  }
}

export default new VehicleRouter().router