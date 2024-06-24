import { Sequelize } from "sequelize-typescript";
import sequelize from "../config/database";
import { Vehicle } from "../model/Vehicle";
import { RouteAverageSpeed } from "../model/RouteAverageSpeed";
import { Op, Transaction } from "sequelize";
import { VehicleType } from "../types/VehicleType";
import { VehicleAvgSpeedType } from "../types/VehicleAvgSpeedType";

interface IVehicleRepo {
  createOne(vehicle: VehicleType): Promise<void>; // add zod validation
  getAll(): Promise<VehicleType[]>;
  getAllTimeDesc(): Promise<Vehicle[]>;
  getAllAvgSpeed(): Promise<VehicleAvgSpeedType[]>;
  getSpecificRoutes(routeNumbers: String[]): Promise<VehicleType[]>;
}

export class VehicleRepo implements IVehicleRepo {
  async createOne(vehicle: VehicleType): Promise<void> {
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

  async getAll(): Promise<VehicleType[]> {
    try {
      const response = await Vehicle.findAll({
        limit: 10000, // pagination could be implemented for better fetching
      });
      return response;
    } catch (err) {
      throw new Error("Failed to fetch the vehicles");
    }
  }

  async getAllTimeDesc(): Promise<Vehicle[]> {
    try {
      const response = await Vehicle.findAll({
        order: [["timestamp", "DESC"]],
        limit: 200000, // there's no need to return all the records to calculate closest
      });
      return response.map((vehicle) => vehicle.dataValues);
    } catch (err) {
      throw new Error("Failed to fetch the vehicles ordered by timestamps");
    }
  }

  // using an aggregation table for this call, so the query response time doesn't depend on the number of records in the db
  async getAllAvgSpeed(): Promise<VehicleAvgSpeedType[]> {
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

  async getSpecificRoutes(routeNumbers: String[]): Promise<VehicleType[]> {
    try {
      const response = await Vehicle.findAll({
        where: {
          route_number: {
            [Op.or]: routeNumbers,
          },
        },
      });
      return response.map((vehicle) => vehicle.dataValues);
    } catch (err) {
      throw new Error("Failed to fetch the metro vehicles");
    }
  }
}
