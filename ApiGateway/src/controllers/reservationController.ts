
import { Request, Response, NextFunction, json } from "express";
import { Router } from "express";
import { relative } from "path";
import KafkaManager from "../kafkaSoftware/kafkaservices/kafkaManager";
import { TestProducer } from "../kafkaSoftware/producer";
import Payload from "../payload";
import { TestConsumer } from "../kafkaSoftware/consumer";




export class ReservationController {

    private controllerRouterObject: Router;
    private KafkaManager: KafkaManager;
    private consumer: any;
    private flightCrudConsumer: any;
    private reservationCrudConsumer: any;
    /**
     *
     */
    constructor() {
        this.initControllerRoutes();
        this.KafkaManager = new KafkaManager();
        this.KafkaManager.setProducer(new TestProducer());
        this.KafkaManager.setConsumer(new TestConsumer());

        this.consumer = this.KafkaManager.createConsumerObject("userCrudResponce", "reservationCrudConsumer-1", "reservationCrudConsumerGroup-1");
        this.flightCrudConsumer = this.KafkaManager.createConsumerObject("flightCrudResponse", "reservationCrudConsumer-2", "reservationCrudConsumerGroup-2");
        this.reservationCrudConsumer = this.KafkaManager.createConsumerObject("reservationResponse", "reservationCrudConsumer-3", "reservationCrudConsumerGroup-3");


    }

    public initControllerRoutes() {
        this.controllerRouterObject = Router();
        this.controllerRouterObject.post("/book", async (req: Request, res: Response, next: any) => {

            const payload = req.body;
            const kafkaPayload = Payload.getPayload(payload.functionName, payload.args);
            /// get the user from the db by unique username
            await this.KafkaManager.publishMessage("userCrud", kafkaPayload);
            await this.KafkaManager.startConsumer(this.consumer);
            const user = this.KafkaManager.getMessage();
            console.log(user.successStatus);
            /// get flight number from the service
            await this.KafkaManager.publishMessage("flightCrud", kafkaPayload);
            await this.KafkaManager.startConsumer(this.flightCrudConsumer);
            const flight = this.KafkaManager.getMessage();
            console.log(flight.successStatus);

            /// send payload to reservation service
            const reservationResponse = {
                flight: flight.successStatus,
                user: user.successStatus
            };
            const reservationsPayload = {
                functionName: "create",
                args: reservationResponse
            };
            const kafkaReservationsPayload = Payload.getPayload(reservationsPayload.functionName, reservationsPayload.args);

            await this.KafkaManager.publishMessage("reservations", kafkaReservationsPayload);
            await this.KafkaManager.startConsumer(this.reservationCrudConsumer);
            const reservation = this.KafkaManager.getMessage();
            console.log(reservation.successStatus);

            res.send(reservation.successStatus);

        });
        this.controllerRouterObject.post("/read", async (req: Request, res: Response, next: any) => {

            const payload = req.body;
            const kafkaPayload = Payload.getPayload(payload.functionName, payload.args);
            await this.KafkaManager.publishMessage("reservations", kafkaPayload);
            res.send("object recieved");

        });
    }
    public getReservationControllerRouterObject() {

        return this.controllerRouterObject;
    }

}