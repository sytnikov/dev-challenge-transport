import { VehicleType } from "./VehicleType";

export type VehiclePartialType = Pick<
  VehicleType,
  "route_number" | "reg_number" | "timestamp" | "speed" | "distance"
>;
