import { Vehicle } from "../model/Vehicle";

interface IVehicleRepo {
  createOne(vehicle: Vehicle): Promise<void>;
  getAll(): Promise<Vehicle[]>;
}

export class VehicleRepo implements IVehicleRepo{
  async createOne(vehicle: Vehicle): Promise<void> {
    try {
      await Vehicle.create({
        route_number: vehicle.route_number,
        reg_number: vehicle.reg_number,
        latitude: vehicle.latitude,
        longitude: vehicle.longitude,
      });
    } catch(err) {
      throw new Error("Failed to create the vehicle");
    }
  }

  async getAll(): Promise<Vehicle[]> {
    try {
      const vehicles = await Vehicle.findAll({
        order: [['timestamp', 'DESC']],
      });
      return vehicles
    } catch(err) {
      throw new Error("Failed to fetch the vehicles");
    }
  }
}