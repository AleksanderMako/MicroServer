import { Router } from "express";
import { UserController } from "./controllers/userRegistrationController";

export default class ApiRouter {

    private controllerObj: UserController;
    private router: Router;

    constructor(injectableCOntrollerObject: UserController) {

        if (!injectableCOntrollerObject) {
            throw new Error("Api controller not specified");
        }


        this.controllerObj = injectableCOntrollerObject;
        this.router = Router();
        this.initApiRoutes();
        console.log("INFO:Router class inited");

    }


    public getApiRouter() {
        return this.router;
    }

    private initApiRoutes() {
        this.router.use("/", this.controllerObj.getUserControllerRouterObject());
    }
}
