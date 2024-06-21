import { Sequelize } from "sequelize-typescript";
import { Vehicle } from "../model/Vehicle";

interface IVehicleRepo {
  getAll(): Promise<Vehicle[]>;
  getAllTimeDesc(): Promise<Vehicle[]>;
  getAllAvgSpeed(): Promise<{route_number: string; average_speed: number;}[]>;
}

export class VehicleRepo implements IVehicleRepo {

  async getAll(): Promise<Vehicle[]> {
    try {
      const response = await Vehicle.findAll();
      return response;
    } catch (err) {
      throw new Error("Failed to fetch the vehicles");
    }
  }

  async getAllTimeDesc(): Promise<Vehicle[]> {
    try {
      const response = await Vehicle.findAll({
        order: [["timestamp", "DESC"]],
        limit: 30000
      });
      return response.map(vehicle => vehicle.dataValues);
    } catch (err) {
      throw new Error("Failed to fetch the vehicles ordered by timestamps");
    }
  }

  async getAllAvgSpeed(): Promise<{route_number: string; average_speed: number;}[]> {
    try {
      const response = await Vehicle.findAll({
        attributes: [
          "route_number",
          [Sequelize.fn("AVG", Sequelize.col("speed")), "average_speed"],
        ],
        group: ["route_number"],
      });
      return response.map(vehicle => vehicle.dataValues);
    } catch (err) {
      throw new Error("Failed to fetch the vehicles average speed");
    }
  }
}
