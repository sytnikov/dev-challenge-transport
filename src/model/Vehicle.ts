import { Column, DataType, Model, Table } from "sequelize-typescript";

@Table({
  tableName: Vehicle.VEHICLE_TABLE_NAME
})

export class Vehicle extends Model{

  public static VEHICLE_TABLE_NAME = "vehicle" as string;
  public static VEHICLE_ID = "id" as string;
  public static VEHICLE_CUSTOMER_NUMBER = "customer_number" as string;
  public static VEHICLE_REG_NUMBER = "reg_number" as string;
  public static VEHICLE_LAT = "latitude" as string;
  public static VEHICLE_LON = "longitude" as string;

  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: Vehicle.VEHICLE_ID
  })
  id!:number

  @Column({
    type: DataType.STRING(100),
    field: Vehicle.VEHICLE_CUSTOMER_NUMBER
  })
  customer_number!:string

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
}
