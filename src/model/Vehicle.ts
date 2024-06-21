import { Column, DataType, Model, Table } from "sequelize-typescript";

@Table({
  tableName: Vehicle.VEHICLE_TABLE_NAME,
  timestamps: false
})

export class Vehicle extends Model{

  public static VEHICLE_TABLE_NAME = "vehicle" as string;
  public static VEHICLE_ID = "id" as string;
  public static VEHICLE_ROUTE_NUMBER = "route_number" as string;
  public static VEHICLE_REG_NUMBER = "reg_number" as string;
  public static VEHICLE_LAT = "latitude" as string;
  public static VEHICLE_LON = "longitude" as string;
  public static VEHICLE_TIMESTAMP = "timestamp" as string;
  public static VEHICLE_SPEED = "speed" as string;
  public static VEHICLE_OPERATOR = "operator" as string;
  public static VEHICLE_DIRECTION = "direction" as string;

  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: Vehicle.VEHICLE_ID
  })
  id!:number

  @Column({
    type: DataType.STRING(100),
    field: Vehicle.VEHICLE_ROUTE_NUMBER
  })
  route_number!:string

  @Column({
    type: DataType.STRING(100),
    field: Vehicle.VEHICLE_REG_NUMBER
  })
  reg_number!:string

  @Column({
    type: DataType.FLOAT,
    field: Vehicle.VEHICLE_LAT
  })
  latitude!:string

  @Column({
    type: DataType.FLOAT,
    field: Vehicle.VEHICLE_LON
  })
  longitude!:string

  @Column({
    type: DataType.DATE,
    field: Vehicle.VEHICLE_TIMESTAMP
  })
  timestamp!:Date

  @Column({
    type: DataType.FLOAT,
    field: Vehicle.VEHICLE_SPEED
  })
  speed!:number

  @Column({
    type: DataType.INTEGER,
    field: Vehicle.VEHICLE_OPERATOR
  })
  operator!:number

  @Column({
    type: DataType.STRING(10),
    field: Vehicle.VEHICLE_DIRECTION
  })
  direction!:string
}
