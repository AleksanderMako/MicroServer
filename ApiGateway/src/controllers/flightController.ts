
import { Request, Response, NextFunction, json } from "express";
import { Router } from "express";
import { relative } from "path";
import KafkaManager from "../kafkaSoftware/kafkaservices/kafkaManager";
import { TestProducer } from "../kafkaSoftware/producer";
import Payload from "../payload";
import { TestConsumer } from "../kafkaSoftware/consumer";
import * as passport from "passport";

export class FlightController {

    private controllerRouterObject: Router;
    private KafkaManager: KafkaManager;
    private consumer: any;
    private reservationCrudConsumer: any;

    /**
     *
     */
    constructor() {
        this.initControllerRoutes();
        this.KafkaManager = new KafkaManager();
        this.KafkaManager.setProducer(new TestProducer());
        this.KafkaManager.setConsumer(new TestConsumer());
        this.consumer = this.KafkaManager.createConsumerObject("flightCrudResponse", "apiFlightCrudConsumer-1", "apiFlightCrudConsumerGroup-1");
        this.reservationCrudConsumer = this.KafkaManager.createConsumerObject("reservationResponse", "reservationCrudConsumer-5", "reservationCrudConsumerGroup-5");

    }

    public initControllerRoutes() {
        this.controllerRouterObject = Router();
        this.controllerRouterObject.use(function (req: Request, res: Response, next: any) {
            res.setHeader("Access-Control-Allow-Origin", "http://localhost:4200");
            res.setHeader("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,PATCH,OPTIONS");
            res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept,Authorization");
            next();
        });
        this.controllerRouterObject.post("/register", passport.authenticate("jwt", { session: false }),
            async (req: Request, res: Response, next: any) => {

                const payload = req.body;
                const kafkaPayload = Payload.getPayload(payload.functionName, payload.args);
                await this.KafkaManager.publishMessage("flightCrud", kafkaPayload);
                await this.KafkaManager.startConsumer(this.consumer);
                const operationStatus = this.KafkaManager.getMessage();
                return res.send(operationStatus);

            });
        this.controllerRouterObject.post("/read", passport.authenticate("jwt", { session: false }), async (req: Request, res: Response, next: any) => {

            const payload = req.body;
            const kafkaPayload = Payload.getPayload(payload.functionName, payload.args);
            await this.KafkaManager.publishMessage("flightCrud", kafkaPayload);
            await this.KafkaManager.startConsumer(this.consumer);
            const operationStatus = this.KafkaManager.getMessage();

            return res.send(operationStatus);

        });
        this.controllerRouterObject.post("/update", passport.authenticate("jwt", { session: false }),
            async (req: Request, res: Response, next: any) => {

                const payload = req.body;
                const kafkaPayload = Payload.getPayload(payload.functionName, payload.args);
                await this.KafkaManager.publishMessage("flightCrud", kafkaPayload);
                await this.KafkaManager.startConsumer(this.consumer);
                const operationStatus = this.KafkaManager.getMessage();
                const update = {
                    Departure: payload.args.departure,
                    Destination: payload.args.destination,
                    airplaneType: payload.args.airplaneType,
                    capacity: payload.args.capacity,
                    Date: payload.args.date
                };
                const query = {
                    flightNumber: payload.args.flightNumber,

                };
                const argument = {
                    query: query,
                    update: update
                };
                const kafkaReservationPayload = Payload.getPayload("update", argument);
                await this.KafkaManager.publishMessage("reservations", kafkaReservationPayload);
                await this.KafkaManager.startConsumer(this.reservationCrudConsumer);
                const reservation = this.KafkaManager.getMessage();
                console.log("reservation response *****************************************************************************************************");

                console.log(reservation.successStatus);
                return res.send(operationStatus.successStatus);

            });
        this.controllerRouterObject.post("/delete", passport.authenticate("jwt", { session: false }),
            async (req: Request, res: Response, next: any) => {

                const payload = req.body;
                const kafkaPayload = Payload.getPayload(payload.functionName, payload.args);
                await this.KafkaManager.publishMessage("flightCrud", kafkaPayload);
                await this.KafkaManager.startConsumer(this.consumer);
                const operationStatus = this.KafkaManager.getMessage();
                console.log(operationStatus.successStatus);
                return res.send(operationStatus.successStatus);

            });
    }
    public getFlightControllerRouterObject() {

        return this.controllerRouterObject;
    }

}