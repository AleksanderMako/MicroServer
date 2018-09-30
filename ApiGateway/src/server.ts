import * as dotenv from "dotenv";
import App from "./app";
import routes from "./routes";
import { UserController } from "./controllers/userRegistrationController";
import app from "./app";
import { Application } from "express";

dotenv.config({ path: ".env" });

export class Server {
    private mockControllerObj: UserController;
    private applicationObject: Application;

    constructor() {

        console.log("INFO:API PORT :" + 4000);
        this.initServer();
    }

    private initServer() {
        this.mockControllerObj = new UserController();
        const apiRoutes = new routes(this.mockControllerObj);
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
