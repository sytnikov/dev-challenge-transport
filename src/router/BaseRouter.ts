import { Router } from "express"

interface IRouter {
  routes(): void
}

abstract class BaseRouter implements IRouter {
  public router: Router
  constructor(){
    this.router = Router()
    this.routes()
  }
  abstract routes(): void
}

export default BaseRouter