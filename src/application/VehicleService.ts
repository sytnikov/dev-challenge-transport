import { Request, Response } from "express";
import { getDistance } from "geolib";

import { VehicleRepo } from "../repository/VehicleRepo";
import { VehicleType } from "../types/VehicleType";
import { VehicleAvgSpeedType } from "../types/VehicleAvgSpeedType";
import { convertToKmH } from "../utils/calculator";
import { VehiclePartialType } from "../types/VehiclePartialType";

interface IVehicleService {
  getVehicles(): Promise<VehicleType[]>;
  getClosestVehicles(req: Request): Promise<VehicleType[]>;
  getVehiclesAvgSpeed(): Promise<VehicleAvgSpeedType[]>;
  getClosestMetroMaxSpeed(): Promise<VehiclePartialType[]>;
}

export class VehicleService implements IVehicleService {
  private vehicleRepo: VehicleRepo;

  constructor(vehicleRepo: VehicleRepo) {
    this.vehicleRepo = vehicleRepo;
  }

  async getVehicles(): Promise<VehicleType[]> {
    return await this.vehicleRepo.getAll();
  }
  async getClosestVehicles(req: Request): Promise<VehicleType[]> {
    const { lat, lon } = req.query;

    const location = {
      latitude: parseFloat(lat as string),
      longitude: parseFloat(lon as string),
    };

    const vehicles: VehicleType[] = await this.vehicleRepo.getAllTimeDesc();

    // get unique newest values for all the routes
    const newestVehiclesMap = new Map<string, VehicleType>();

    for (const vehicle of vehicles) {
      const existingVehicle = newestVehiclesMap.get(vehicle.reg_number);
      if (!existingVehicle || vehicle.timestamp > existingVehicle.timestamp) {
        newestVehiclesMap.set(vehicle.reg_number, vehicle);
      }
    }

    const uniqueVehicles: VehicleType[] = Array.from(
      newestVehiclesMap.values()
    );

    // consider as the newest only those vehicles that have a timestamp record in a 5 sec window before now
    const now = new Date();
    const fiveSecondsFromNow = new Date(now.getTime() - 5000);

    const closestVehicles: VehicleType[] = uniqueVehicles
      .filter((uniqueVehicle) => {
        const vehicleTime = new Date(uniqueVehicle.timestamp);
        return vehicleTime <= now && vehicleTime >= fiveSecondsFromNow;
      })
      .map((uniqueVehicle) => ({
        ...uniqueVehicle,
        distance: getDistance(location, {
          latitude: parseFloat(uniqueVehicle.latitude),
          longitude: parseFloat(uniqueVehicle.longitude),
        }),
      }))
      .sort((a, b) => a.distance - b.distance)
      .slice(0, 3);

    return closestVehicles;
  }

  async getVehiclesAvgSpeed(): Promise<VehicleAvgSpeedType[]> {
    const vehiclesWithAverageSpeed: VehicleAvgSpeedType[] =
      await this.vehicleRepo.getAllAvgSpeed();
    return vehiclesWithAverageSpeed.map((vehicle) => ({
      ...vehicle,
      average_speed: convertToKmH(vehicle.average_speed),
    }));
  }

  async getClosestMetroMaxSpeed(): Promise<VehiclePartialType[]> {
    const metros: VehicleType[] = await this.vehicleRepo.getSpecificRoutes([
      "M1",
      "M2",
    ]);

    const location = {
      lat: 60.18408281913011,
      lon: 24.96009069614847,
    };

    const distanceFromLocation = 400;

    const closestMetros: VehicleType[] = metros
      .map((metro) => ({
        ...metro,
        distance: getDistance(location, {
          latitude: parseFloat(metro.latitude),
          longitude: parseFloat(metro.longitude),
        }),
      }))
      .filter((metro) => metro.distance <= distanceFromLocation);

    // map is needed to store unique vehicles with the maximum speed observed so far
    const closestMetrosMap = new Map<string, VehiclePartialType>();

    closestMetros.forEach((metro) => {
      const { route_number, reg_number, timestamp, speed, distance }: VehiclePartialType = metro;

      if (!closestMetrosMap.has(reg_number)) {
        closestMetrosMap.set(reg_number, {
          route_number,
          reg_number,
          timestamp,
          speed,
          distance,
        });
      } else {
        const existingMetro = closestMetrosMap.get(reg_number);
        if (existingMetro && speed > existingMetro.speed) {
          closestMetrosMap.set(reg_number, {
            ...existingMetro,
            speed,
            timestamp,
            distance,
          });
        }
      }
    });

    const closestMetroMaxSpeed: VehiclePartialType[] = Array.from(
      closestMetrosMap.values());

    return closestMetroMaxSpeed;
  }
}
