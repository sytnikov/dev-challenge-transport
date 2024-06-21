import { Sequelize } from "sequelize-typescript";
import sequelize from "../config/database";
import { Vehicle } from "../model/Vehicle";
import { RouteAverageSpeed } from "../model/RouteAverageSpeed";
import { Transaction } from "sequelize";

interface IVehicleRepo {
  createOne(vehicle: any): Promise<void>; // add zod validation
  getAll(): Promise<Vehicle[]>;
  getAllTimeDesc(): Promise<Vehicle[]>;
  getAllAvgSpeed(): Promise<{ route_number: string; average_speed: number }[]>;
}

export class VehicleRepo implements IVehicleRepo {
  async createOne(vehicle: any): Promise<void> {
    let transaction: Transaction | undefined | null = null;
    try {
      transaction = await sequelize?.transaction();

      await Vehicle.create(vehicle, { transaction });

      const [routeAvgSpeed, created] = await RouteAverageSpeed.findOrCreate({
        where: { route_number: vehicle.route_number },
        defaults: {
          route_number: vehicle.route_number,
          total_speed: vehicle.speed,
          vehicle_count: 1,
        },
        transaction,
      });

      if (!created) {
        await routeAvgSpeed.update(
          {
            total_speed: sequelize?.literal(`total_speed + ${vehicle.speed}`),
            vehicle_count: sequelize?.literal(`vehicle_count + 1`),
          },
          { transaction }
        );
      }

      await transaction?.commit();
      
    } catch (err) {
      await transaction?.rollback();
      console.error("Error creating vehicle", err);
      // throw new Error("Failed to create a vehicle")
    }
  }

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
        limit: 30000,
      });
      return response.map((vehicle) => vehicle.dataValues);
    } catch (err) {
      throw new Error("Failed to fetch the vehicles ordered by timestamps");
    }
  }

  async getAllAvgSpeed(): Promise<
    { route_number: string; average_speed: number }[]
  > {
    try {
      const response = await RouteAverageSpeed.findAll({
        attributes: [
          "route_number",
          [Sequelize.literal(`total_speed / vehicle_count`), "average_speed"],
        ],
      });
      return response.map((vehicle) => vehicle.dataValues);
    } catch (err) {
      throw new Error("Failed to fetch the vehicles average speed");
    }
  }
}
