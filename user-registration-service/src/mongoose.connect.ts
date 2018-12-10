import * as mongoose from "mongoose";
import UserCrud from "./user.service.ts/userCrud";
import Payload from "./payload";
import { Producer } from "kafka-node";
import { TestConsumer } from "./kafkaSoftware/consumer";
import { TestProducer } from "./kafkaSoftware/producer";
import KafkaManager from "./kafkaSoftware/kafkaservices/kafkaManager";
import * as schema from "./schemas/userSchema";
import UserRepository from "./repository/userRepository";

let db: any;
let userSchema: mongoose.Schema;
let userRepositoryObject: UserRepository;
let userService: UserCrud;
const initCrudService = (connection: any, payload: Payload) => {

    // init should be taking the payload
    userService.init(payload);
};

const connect = async () => {
    try {


        userSchema = schema.makeUserSchema();
        db = await mongoose.connect("mongodb://mongoDB:27017/user");
        console.log("Connected");
        userRepositoryObject = new UserRepository(db, userSchema);
        userService = new UserCrud( userRepositoryObject);




    } catch (err) {

        console.log(err);
    }
};

const kafkaManger = async () => {
    connect();

    const arr = ["", "create", "read"];
    const manager = new KafkaManager();
    manager.setProducer(new TestProducer());
    manager.setConsumer(new TestConsumer());
    const consumer = manager.createConsumerObject("userCrud", "id-1", "g-11");
    // make saga consumer
    let i = 0;

    // await manager.publishMessage("userCrud", payload);
    while (true) {
        await manager.startConsumer(consumer);
        const message = manager.getMessage();
        // console.log("******************************************************");
        // console.log(message);
        // console.log("*******************************************************");
        // const payload = Payload.getPayload( message.functionName, message.args);

        console.log("\n");
        initCrudService(db, message);
    }
    i++;

};

kafkaManger();

// connect();


