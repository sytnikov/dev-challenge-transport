import "dotenv/config"

// import * as dotenv from "dotenv";
// dotenv.config();

import { Sequelize } from "sequelize-typescript";
import { Vehicle } from "../model/Vehicle";
import { RouteAverageSpeed } from "../model/RouteAverageSpeed";

class Database{
  public sequelize: Sequelize | undefined;

  private POSTGRES_DB = process.env.POSTGRES_DB as string;
  private POSTGRES_HOST = process.env.POSTGRES_HOST as string;
  private POSTGRES_PORT = process.env.POSTGRES_PORT as unknown as number;
  private POSTGRES_USERNAME = process.env.POSTGRES_USERNAME as unknown as string;
  private POSTGRES_PASSWORD = process.env.POSTGRES_PASSWORD as unknown as string;

  constructor() {
    this.connectToPostgreSQL();
  }

  private async connectToPostgreSQL() {
    this.sequelize = new Sequelize({
      database: this.POSTGRES_DB,
      host: this.POSTGRES_HOST,
      port: this.POSTGRES_PORT,
      username: this.POSTGRES_USERNAME,
      password: this.POSTGRES_PASSWORD,
      dialect: "postgres",
      models:[Vehicle, RouteAverageSpeed],
      logging: false,
    });

    await this.sequelize.authenticate().then(()=>{
      console.log('✅ Successfully connected to PostgreSQL database')
    }).catch((err) => {
      console.log('❌ Unable to connect to PostgreSQL database', err)
    })
  }
}

export default new Database().sequelize