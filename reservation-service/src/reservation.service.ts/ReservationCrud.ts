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
                break;
            case "delete":
                console.log("INFO: delete Method activated ");
                break;
            default: console.log("No method invoked here "); break;
        }

    }

    public create(args: any) {

        return this.reservationRepo.create(args)
            .then(async () => {
                await this.KafkaManager.publishMessage("reservationResponse", { successStatus: "success" });

            })
            .catch(async (err: Error) => {
                await this.KafkaManager.publishMessage("reservationResponse", { successStatus: JSON.stringify(err) });

            });
        // TODO:change the topic for flights publishing
    }

    public async  read() {
        const reservations = await this.reservationRepo.readAll();
        await this.KafkaManager.publishMessage("reservationResponse", { successStatus: JSON.stringify(reservations) });
        console.log(reservations);
    }

    // update()  {}

    // delete() {}
}