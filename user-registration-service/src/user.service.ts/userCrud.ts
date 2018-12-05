import Payload from "../payload";
import * as userSchema from "../schemas/userSchema";
import * as util from "util";
import * as mongoose from "mongoose";
import KafkaManager from "../kafkaSoftware/kafkaservices/kafkaManager";
import { TestProducer } from "../kafkaSoftware/producer";
import Irepository from "../repository/Irepository";
import UserCrudDTO from "../userServiceDTOS/userCrudDTO";
export default class UserCrud {

    private payload: Payload;
    private functionName: string;
    private args: any;
    private userRepo: Irepository;
    private KafkaManager: KafkaManager;
    constructor(userRepositoryObject: Irepository) {

        this.userRepo = userRepositoryObject;
        this.initAdminPersonel();
        this.KafkaManager = new KafkaManager();
        this.KafkaManager.setProducer(new TestProducer());
    }
    public init(payload: any) {
        this.payload = Payload.getPayload(payload.functionName, payload.args);
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
            case "readCustomers":
                console.log("INFO: readCustomers Method activated ");

                this.readCustomersBy_usernames(this.payload.getArguments());
                break;
            default: console.log("No method invoked here "); break;
        }

    }

    public create(args: any) {

        return this.userRepo.create(args)
            .then(async () => {
                const createResponse: UserCrudDTO = {
                    opStatus: "success",
                    hasError: false,
                    error: undefined,
                    data: args
                };
                await this.KafkaManager.publishMessage("userCrudResponce", { successStatus: JSON.stringify(createResponse) });
            })
            .catch(async (err: Error) => {
                const createResponse: UserCrudDTO = {
                    opStatus: "failed",
                    hasError: true,
                    error: err,
                    data: undefined
                };
                console.log("ERROR in Crud : " + err);
                await this.KafkaManager.publishMessage("userCrudResponce", { successStatus: JSON.stringify(createResponse) });
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

    public update(args: any) {

        return this.userRepo.update(args)
            .then(async (user: any) => {
                console.log("User in crud " + user);
                await this.KafkaManager.publishMessage("userCrudResponce", { successStatus: JSON.stringify(user) });

            })
            .catch(async (err: Error) => {
                await this.KafkaManager.publishMessage("userCrudResponce", { successStatus: JSON.stringify(err) });

            });
    }

    public delete(args: any) {
        return this.userRepo.delete(args)
            .then(async (deleted: any) => {
                await this.KafkaManager.publishMessage("userCrudResponce", { successStatus: JSON.stringify(deleted) });

            })
            .catch(async (err: Error) => {
                await this.KafkaManager.publishMessage("userCrudResponce", { successStatus: JSON.stringify(err) });
            });
    }

    public readCustomersBy_usernames(data: any) {
        return this.userRepo.readByUsernames(data)
            .then(async (perflight_Customers: any) => {
                await this.KafkaManager.publishMessage("userCrudResponce", { successStatus: JSON.stringify(perflight_Customers) });

            })
            .catch(async (err: Error) => {
                await this.KafkaManager.publishMessage("userCrudResponce", { successStatus: JSON.stringify(err) });

            });
    }

    private initAdminPersonel() {

        const admin1 = {
            username: "admin1",
            firstname: "adminName",
            lastName: "adminLastname",
            password: "admin1",
            typeOfUser: "admin",
            age: 30
        };

        return this.userRepo.seedAdmin(admin1)
            .then(() => {

            })
            .catch((err: Error) => {
                console.log("Error while initializing admin identity ");
                console.log("err:" + JSON.stringify(err));
            });
    }
}