import { Router } from "express";
import { UserController } from "./controllers/userRegistrationController";
import { FlightController } from "./controllers/flightController";

export default class ApiRouter {

    private controllerObj: UserController;
    private FlightController: FlightController;
    private router: Router;

    constructor(injectableCOntrollerObject: UserController, injectableFlightCOntroller: FlightController) {

        if (!injectableCOntrollerObject) {
            throw new Error("Api controller not specified");
        }


        this.controllerObj = injectableCOntrollerObject;
        this.FlightController = injectableFlightCOntroller;
        this.router = Router();
        this.initApiRoutes();
        console.log("INFO:Router class inited");

    }


    public getApiRouter() {
        return this.router;
    }

    private initApiRoutes() {
        this.router.use("/user", this.controllerObj.getUserControllerRouterObject());
        this.router.use("/flight", this.FlightController.getFlightControllerRouterObject());
    }
}
