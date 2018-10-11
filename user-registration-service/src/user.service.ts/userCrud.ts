import Payload from "../payload";
import * as userSchema from "../schemas/userSchema";
import * as util from "util";
import * as mongoose from "mongoose";
import KafkaManager from "../kafkaSoftware/kafkaservices/kafkaManager";
import { TestProducer } from "../kafkaSoftware/producer";
import Irepository from "../repository/Irepository";

export default class UserCrud {

    private payload: Payload;
    private functionName: string;
    private args: any;
    private userRepo: Irepository;
    private KafkaManager: KafkaManager;
    constructor(payload: any, userRepositoryObject: Irepository) {

        this.payload = Payload.getPayload(payload.functionName, payload.args);
        this.userRepo = userRepositoryObject;
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
                break;
            case "delete":
                console.log("INFO: delete Method activated ");
                break;
            default: console.log("No method invoked here "); break;
        }

    }

    public create(args: any) {
        return this.userRepo.create(args)
            .then(async () => {
                await this.KafkaManager.publishMessage("userCrudResponce", { successStatus: "success" });
            })
            .catch(async (err: Error) => {
                console.log("ERROR in Crud : " + err);
                await this.KafkaManager.publishMessage("userCrudResponce", { successStatus: JSON.stringify(err) });
            });
    }

    public async  read() {
        const users = await this.userRepo.readAll();
        await this.KafkaManager.publishMessage("userCrudResponce", { successStatus: JSON.stringify(users) });
        console.log(users);
    }

    public async readOne(args: any) {
        const user = await this.userRepo.readOne(args);
        await this.KafkaManager.publishMessage("userCrudResponce", { successStatus: JSON.stringify(user) });

        console.log(user);

    }

    // update()  {}

    // delete() {}
}