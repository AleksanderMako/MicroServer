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
            case "readOne":
                console.log("INFO: readOne Method activated ");
                console.log("\n ");
                console.log("\n ");
                this.readOne(this.payload.getArguments());

                break;
            case "update":
                console.log("INFO: update Method activated ");
                this.update(this.payload.getArguments());
                break;
            case "delete":
                console.log("INFO: delete Method activated ");
                this.delete(this.payload.getArguments());
                break;
            default: console.log("No method invoked here "); break;
        }

    }

    public create(args: any) {
        return this.flightRepo.create(args)
            .then(async (response: any) => {
                await this.KafkaManager.publishMessage("flightCrudResponse", { successStatus: JSON.stringify(response) });
            })
            .catch(async (err: Error) => {
                console.log("Error in crud: " + err);
                await this.KafkaManager.publishMessage("flightCrudResponse", { successStatus: JSON.stringify(err) });

            });
        // TODO:change the topic for flights publishing
    }

    public async  read() {
        const flights = await this.flightRepo.readAll();
        console.log("Flight crud says flight payload is : ");
        console.log(JSON.stringify (flights));
        await this.KafkaManager.publishMessage("flightCrudResponse", { successStatus: JSON.stringify(flights) });
        console.log(flights);
    }
    public async  readOne(args: any) {
        const flight = await this.flightRepo.readOne(args);
        await this.KafkaManager.publishMessage("flightCrudResponse", { successStatus: JSON.stringify(flight) });
        console.log(flight);
    }

    public update(args: any) {
        return this.flightRepo.update(args)
            .then(async (flight: any) => {
                await this.KafkaManager.publishMessage("flightCrudResponse", { successStatus: JSON.stringify(flight) });

            })
            .catch(async (err: Error) => {
                await this.KafkaManager.publishMessage("flightCrudResponse", { successStatus: JSON.stringify(err) });

            });
    }

    public delete(args: any) {
        return this.flightRepo.delete(args)
            .then(async (deleted: any) => {
                await this.KafkaManager.publishMessage("flightCrudResponse", { successStatus: JSON.stringify(deleted) });

            })
            .catch(async (err: Error) => {
                await this.KafkaManager.publishMessage("flightCrudResponse", { successStatus: JSON.stringify(err) });
            });
    }
}

