
import { Request, Response, NextFunction, json } from "express";
import { Router } from "express";
import { relative } from "path";
import KafkaManager from "../kafkaSoftware/kafkaservices/kafkaManager";
import { TestProducer } from "../kafkaSoftware/producer";
import Payload from "../payload";
import { TestConsumer } from "../kafkaSoftware/consumer";




export class FlightController {

    private controllerRouterObject: Router;
    private KafkaManager: KafkaManager;
    private consumer: any;
    /**
     *
     */
    constructor() {
        this.initControllerRoutes();
        this.KafkaManager = new KafkaManager();
        this.KafkaManager.setProducer(new TestProducer());
        this.KafkaManager.setConsumer(new TestConsumer());
        this.consumer = this.KafkaManager.createConsumerObject("flightCrudResponse", "apiFlightCrudConsumer-1", "apiFlightCrudConsumerGroup-1");
    }

    public initControllerRoutes() {
        this.controllerRouterObject = Router();
        this.controllerRouterObject.use(function (req: Request, res: Response, next: any) {
            res.setHeader("Access-Control-Allow-Origin", "http://localhost:4200");
            res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
            next();
        });
        this.controllerRouterObject.post("/register", async (req: Request, res: Response, next: any) => {

            const payload = req.body;
            const kafkaPayload = Payload.getPayload(payload.functionName, payload.args);
            await this.KafkaManager.publishMessage("flightCrud", kafkaPayload);
            await this.KafkaManager.startConsumer(this.consumer);
            const operationStatus = this.KafkaManager.getMessage();
            res.send(operationStatus);

        });
        this.controllerRouterObject.post("/read", async (req: Request, res: Response, next: any) => {

            const payload = req.body;
            const kafkaPayload = Payload.getPayload(payload.functionName, payload.args);
            await this.KafkaManager.publishMessage("flightCrud", kafkaPayload);
            await this.KafkaManager.startConsumer(this.consumer);
            const operationStatus = this.KafkaManager.getMessage();

            res.send(operationStatus.successStatus);

        });
        this.controllerRouterObject.post("/update", async (req: Request, res: Response, next: any) => {

            const payload = req.body;
            const kafkaPayload = Payload.getPayload(payload.functionName, payload.args);
            await this.KafkaManager.publishMessage("flightCrud", kafkaPayload);
            await this.KafkaManager.startConsumer(this.consumer);
            const operationStatus = this.KafkaManager.getMessage();
            //  console.log(operationStatus.messageStatus);
            res.send(operationStatus.successStatus);

        });
        this.controllerRouterObject.post("/delete", async (req: Request, res: Response, next: any) => {

            const payload = req.body;
            const kafkaPayload = Payload.getPayload(payload.functionName, payload.args);
            await this.KafkaManager.publishMessage("flightCrud", kafkaPayload);
            await this.KafkaManager.startConsumer(this.consumer);
            const operationStatus = this.KafkaManager.getMessage();
            console.log(operationStatus.successStatus);
            res.send(operationStatus.successStatus);

        });
    }
    public getFlightControllerRouterObject() {

        return this.controllerRouterObject;
    }

}