import { Request, Response, NextFunction, json, Router } from "express";
import KafkaManager from "../kafkaSoftware/kafkaservices/kafkaManager";
import { TestProducer } from "../kafkaSoftware/producer";
import { TestConsumer } from "../kafkaSoftware/consumer";
import Payload from "../payload";
import * as passport from "passport";
import * as passportjwt from "passport-jwt";
import * as jwt from "jsonwebtoken";

export class LoginController {
    private KafkaManager: KafkaManager;
    private consumer: any;
    private loginControllerObject: Router;
    constructor() {
        this.KafkaManager = new KafkaManager();
        this.KafkaManager.setProducer(new TestProducer());
        this.KafkaManager.setConsumer(new TestConsumer());
        this.consumer = this.KafkaManager.createConsumerObject("userCrudResponce", "loginConsumer-1", "loginConsumergroup-1");
        this.initLoginRoute();
    }
    private initLoginRoute() {
        this.loginControllerObject = Router();
        this.loginControllerObject.post("/user", async (req: Request, res: Response) => {
            const payload = req.body;
            if (!req.body) {
                res.status(400).send("empty payload !!");
            }
            const kafkaPayload = Payload.getPayload(payload.functionName, payload.args);
            await this.KafkaManager.publishMessage("userCrud", kafkaPayload);
            await this.KafkaManager.startConsumer(this.consumer);
            const operationStatus = this.KafkaManager.getMessage();
            console.log(operationStatus.successStatus);

            if (!operationStatus.successStatus) {
                res.status(400).send("user not found ");
            }
            const token = jwt.sign(payload, "process.env.SECRET");
            res.send(token);

        });

    }
    public getRouter() {
        return this.loginControllerObject;
    }
}