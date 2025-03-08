// Under Development
import { AppController } from "../../../controllers";
import { Router } from "express";
const { Home } = new AppController();

const appRouter:Router = Router();

appRouter.route("/").get(Home);

export default appRouter;