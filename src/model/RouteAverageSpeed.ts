import { Column, DataType, Model, Table } from "sequelize-typescript";

@Table({
  tableName: RouteAverageSpeed.RAS_TABLE_NAME,
  timestamps: false,
})
export class RouteAverageSpeed extends Model {
  public static RAS_TABLE_NAME = "route_average_speed" as string;
  public static RAS_ROUTE_NUMBER = "route_number" as string;
  public static RAS_TOTAL_SPEED = "total_speed" as string;
  public static RAS_VEHICLE_COUNT = "vehicle_count" as string;

  @Column({
    type: DataType.STRING(100),
    primaryKey: true,
    field: RouteAverageSpeed.RAS_ROUTE_NUMBER,
  })
  route_number!: string;

  @Column({
    type: DataType.FLOAT,
    field: RouteAverageSpeed.RAS_TOTAL_SPEED,
  })
  total_speed!: number;

  @Column({
    type: DataType.INTEGER,
    field: RouteAverageSpeed.RAS_VEHICLE_COUNT,
  })
  vehicle_count!: number;
}
