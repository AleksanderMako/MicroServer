import Payload from "../payload";
import * as userSchema from "../schemas/flightSchema";
import * as util from "util";
import * as mongoose from "mongoose";
import KafkaManager from "../kafkaSoftware/kafkaservices/kafkaManager";
import { TestProducer } from "../kafkaSoftware/producer";
import Irepository from "../repository/Irepository";

export default class FlightsCrud {

    private payload: Payload;
    private functionName: string;
    private args: any;
    private flightRepo: Irepository;
    private KafkaManager: KafkaManager;
    constructor(payload: any, flightRepositoryObject: Irepository) {

        this.payload = Payload.getPayload(payload.functionName, payload.args);
        this.flightRepo = flightRepositoryObject;
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

    public async  create(args: any) {
        await this.flightRepo.create(args);
        // TODO:change the topic for flights publishing
        await this.KafkaManager.publishMessage("userCrudResponce", { successStatus: "success" });
    }

    public async  read() {
        const users = await this.flightRepo.readAll();
        console.log(users);
    }

    // update()  {}

    // delete() {}
}