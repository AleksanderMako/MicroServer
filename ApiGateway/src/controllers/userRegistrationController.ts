
import { Request, Response, NextFunction, json } from "express";
import { Router } from "express";
import { relative } from "path";
import KafkaManager from "../kafkaSoftware/kafkaservices/kafkaManager";
import { TestProducer } from "../kafkaSoftware/producer";
import Payload from "../payload";




export class UserController {

    private controllerRouterObject: Router;
    private KafkaManager: KafkaManager;
    /**
     *
     */
    constructor() {
        this.initControllerRoutes();
        this.KafkaManager = new KafkaManager();
        this.KafkaManager.setProducer(new TestProducer());



    }

    public initControllerRoutes() {
        this.controllerRouterObject = Router();
        this.controllerRouterObject.post("/register", async (req: Request, res: Response, next: any) => {

            const payload = req.body;
            const kafkaPayload = Payload.getPayload(payload.functionName, payload.args);
           await this.KafkaManager.publishMessage("userCrud", kafkaPayload);
            res.send("object recieved");

        });
    }
    public getUserControllerRouterObject() {

        return this.controllerRouterObject;
    }

}