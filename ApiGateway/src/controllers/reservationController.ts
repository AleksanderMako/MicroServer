
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
        this.controllerRouterObject.use(function (req: Request, res: Response, next: any) {
            res.setHeader("Access-Control-Allow-Origin", "http://localhost:4200");
            res.setHeader("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,PATCH,OPTIONS");
            res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept,Authorization");
            next();
        });
        this.controllerRouterObject.post("/book", async (req: Request, res: Response, next: any) => {
            if (req.body.functionName.toString() !== "readOne") {
                res.send("Must call book method");
            } else {
                const payload = req.body;
                console.log("****************************************************************************************");

                console.log(payload.args.seatNumber);
                console.log("****************************************************************************************");

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
                    user: user.successStatus,
                    seatNumber: payload.args.seatNumber
                };
                const reservationsPayload = {
                    functionName: "create",
                    args: reservationResponse
                };
                const kafkaReservationsPayload = Payload.getPayload(reservationsPayload.functionName, reservationsPayload.args);

                await this.KafkaManager.publishMessage("reservations", kafkaReservationsPayload);
                await this.KafkaManager.startConsumer(this.reservationCrudConsumer);
                const reservation = this.KafkaManager.getMessage();
                console.log("reservation response *****************************************************************************************************");

                console.log(reservation.successStatus);

                //   update seat
                const kafkaPayloadForSeat = Payload.getPayload("updateSeat", payload.args);

                await this.KafkaManager.publishMessage("flightCrud", kafkaPayloadForSeat);
                await this.KafkaManager.startConsumer(this.flightCrudConsumer);
                const seatUpdate = this.KafkaManager.getMessage();
                console.log(seatUpdate.successStatus);
                res.send(reservation.successStatus);
            }

        });
        this.controllerRouterObject.post("/read", async (req: Request, res: Response, next: any) => {
            if (req.body.functionName.toString() !== "readReservationsByCustomer") {
                res.send("Must call read method ");
            } else {
                const payload = req.body;
                const kafkaPayload = Payload.getPayload("readReservationsByCustomer", payload.args);
                await this.KafkaManager.publishMessage("reservations", kafkaPayload);
                await this.KafkaManager.startConsumer(this.reservationCrudConsumer);
                const reservations = this.KafkaManager.getMessage();

                res.send(reservations.successStatus);
            }


        });
        this.controllerRouterObject.post("/update", async (req: Request, res: Response, next: any) => {

            if (req.body.functionName.toString() !== "update") {
                res.send("Must call update method ");
            } else {
                const payload = req.body;
                const kafkaPayload = Payload.getPayload(payload.functionName, payload.args);
                await this.KafkaManager.publishMessage("reservations", kafkaPayload);
                await this.KafkaManager.startConsumer(this.reservationCrudConsumer);
                const reservations = this.KafkaManager.getMessage();

                res.send((reservations.successStatus));
            }


        });
        this.controllerRouterObject.post("/readCustomers", async (req: Request, res: Response, next: any) => {

            if (req.body.functionName !== "readCustomers") {
                res.send("Must call readCustomers method ");
            } else {
                const payload = req.body;
                const kafkaPayload = Payload.getPayload(payload.functionName, payload.args);
                await this.KafkaManager.publishMessage("reservations", kafkaPayload);
                await this.KafkaManager.startConsumer(this.reservationCrudConsumer);
                const reservations = this.KafkaManager.getMessage();

                const customers = JSON.parse(reservations.successStatus.toString());
                console.log(customers);

                const UsersInflightPayload = Payload.getPayload(payload.functionName, customers);
                /// get the user from the db by unique username
                await this.KafkaManager.publishMessage("userCrud", UsersInflightPayload);
                await this.KafkaManager.startConsumer(this.consumer);
                const users = this.KafkaManager.getMessage();
                //  users.successStatus = users.successStatus.map((user: any) => {
                //      return JSON.parse(user);
                //  });
                console.log(typeof JSON.parse(users.successStatus));
                res.send(JSON.parse(users.successStatus));
            }


        });
    }
    public getReservationControllerRouterObject() {

        return this.controllerRouterObject;
    }

}