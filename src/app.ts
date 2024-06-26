import express, { Application, Request, Response } from "express";

import Database from "./config/database";
import { VehicleRouter } from "./router/VehicleRouter";

class App {
  public app: Application;

  constructor() {
    this.app = express();
    this.plugins();
    this.databaseSync();
    this.routes();
  }

  protected plugins(): void {
    this.app.use(express.json())
    this.app.use(express.urlencoded({ extended: true}))
    // if added frontend CORS needs to be added
  }

  protected databaseSync(): void {
    Database?.sync();
  }

  protected routes(): void {
    this.app.route("/").get((req: Request, res: Response) => {
      res.send("Welcome home!")
    })
    this.app.use("/api/v1/vehicles", new VehicleRouter().router)
  }
}

const app = new App().app 

export default app