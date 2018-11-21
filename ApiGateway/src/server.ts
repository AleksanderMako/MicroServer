import * as dotenv from "dotenv";
import App from "./app";
import routes from "./routes";
import { UserController } from "./controllers/userRegistrationController";
import app from "./app";
import { Application } from "express";
import { FlightController } from "./controllers/flightController";
import { ReservationController } from "./controllers/reservationController";
import { LoginController } from "./controllers/loginController";

dotenv.config({ path: ".env" });

export class Server {
    private UserController: UserController;
    private FlightController: FlightController;
    private ReservationController: ReservationController;
    private applicationObject: Application;
    private loginController: LoginController;

    constructor() {

        console.log("INFO:API PORT :" + 4000);
        this.initServer();
    }

    private initServer() {
        this.UserController = new UserController();
        this.FlightController = new FlightController();
        this.ReservationController = new ReservationController();
        this.loginController = new LoginController();
        const apiRoutes = new routes(this.UserController, this.FlightController, this.ReservationController, this.loginController);
        this.applicationObject = new app(apiRoutes).getApp();
        this.applicationObject.set("port", 4000);
        console.log("INFO:Init method completed");

    }

    public startListening() {
        this.applicationObject.listen(4000);
        console.log("app started listening ");
    }

    public getApplication() {
        return this.applicationObject;
    }
}
