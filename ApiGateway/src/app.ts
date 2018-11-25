import * as express from "express";
import * as bodyParser from "body-parser";
import ApiRouter from "./routes";
import * as passport from "passport";
import * as strategy from "./authentication/jwtAuthentication";
export default class App {


    private app: express.Application;
    private router: ApiRouter;
    constructor(apiRouter: ApiRouter) {
        this.app = express();
        this.router = apiRouter;
        this.middleware();
        this.initApplicationRoutes();
        console.log("INFO:Application class inited ");

    }

    private middleware() {
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({ extended: false }));
        passport.use(strategy.strategy);
        this.app.use(passport.initialize());

    }

    public getApp() {

        return this.app;
    }

    private initApplicationRoutes() {
        this.app.use("/api", this.router.getApiRouter());
    }
}
