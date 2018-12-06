import Payload from "../payload";
import * as userSchema from "../schemas/ReservationSchema";
import * as util from "util";
import * as mongoose from "mongoose";
import KafkaManager from "../kafkaSoftware/kafkaservices/kafkaManager";
import { TestProducer } from "../kafkaSoftware/producer";
import Irepository from "../repository/Irepository";

export default class ReservationssCrud {

    private payload: Payload;
    private functionName: string;
    private args: any;
    private reservationRepo: Irepository;
    private KafkaManager: KafkaManager;

    constructor(payload: any, reservationRepositoryObject: Irepository) {

        this.payload = Payload.getPayload(payload.functionName, payload.args);
        this.reservationRepo = reservationRepositoryObject;
        this.KafkaManager = new KafkaManager();
        this.KafkaManager.setProducer(new TestProducer());
    }
    public init() {

        this.functionName = this.payload.getFucnName();
        switch (this.functionName) {

            case "create":
                console.log("INFO: Create Method activated ");
                console.log("\n ");
                console.log("\n ");
                console.log("INFO: Recieved payload:" + this.payload.getArguments());
                this.create(this.payload.getArguments());
                break;
            case "read":
                console.log("INFO: read Method activated ");
                console.log("\n ");
                console.log("\n ");
                this.read();

                break;
            case "update":
                console.log("INFO: update Method activated ");
                this.update(this.payload.getArguments());
                break;
            case "readCustomers":
                this.readCustomersPerFlight(this.payload.getArguments());
                break;
            case "deleteReservationByCustomer":
                this.removeReservationByCustomer(this.payload.getArguments());
                break;
            case "readReservationsByCustomer":
                this.readReservationsByCustomer(this.payload.getArguments());
                break;
            case "delete":
                console.log("INFO: delete Method activated ");
                break;
            default: console.log("No method invoked here "); break;
        }

    }

    public create(args: any) {

        return this.reservationRepo.create(args)
            .then(async (response: any) => {
                await this.KafkaManager.publishMessage("reservationResponse", { successStatus: JSON.stringify(response) });

            })
            .catch(async (err: Error) => {
                await this.KafkaManager.publishMessage("reservationResponse", { successStatus: JSON.stringify(err) });

            });
    }

    public async  read() {
        const reservations = await this.reservationRepo.readAll();
        await this.KafkaManager.publishMessage("reservationResponse", { successStatus: JSON.stringify(reservations) });
        console.log(reservations);
    }

    public update(data: any) {

        return this.reservationRepo.update(data)
            .then(async (document: any) => {
                await this.KafkaManager.publishMessage("reservationResponse", { successStatus: JSON.stringify(document) });

            })
            .catch(async (err: Error) => {
                await this.KafkaManager.publishMessage("reservationResponse", { successStatus: JSON.stringify(err) });

            });
    }

    public readCustomersPerFlight(data: any) {
        return this.reservationRepo.findCustomersInFlight(data)
            .then(async (users_in_flight: any) => {
                await this.KafkaManager.publishMessage("reservationResponse", { successStatus: JSON.stringify(users_in_flight) });

            })
            .catch(async (err: Error) => {
                await this.KafkaManager.publishMessage("reservationResponse", { successStatus: JSON.stringify(err) });

            });
    }
    public removeReservationByCustomer(data: any) {
        return this.reservationRepo.removeReservationBYCustomer(data)
            .then(async (response: any) => {
                await this.KafkaManager.publishMessage("reservationResponse", { successStatus: JSON.stringify(response) });

            })
            .catch(async (err: Error) => {
                await this.KafkaManager.publishMessage("reservationResponse", { successStatus: JSON.stringify(err) });

            });
    }

    public readReservationsByCustomer(data: any) {
        return this.reservationRepo
            .findUserReservations(data)
            .then(async (response: any) => {
                await this.KafkaManager.publishMessage("reservationResponse", { successStatus: JSON.stringify(response) });

            })
            .catch(async (err: Error) => {
                await this.KafkaManager.publishMessage("reservationResponse", { successStatus: JSON.stringify(err) });

            });
    }
}