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

const initCrudService = (connection: any, payload: Payload) => {

    const userService = new UserCrud(payload, userRepositoryObject);
    userService.init();
};

const connect = async () => {
    try {


        userSchema = schema.makeUserSchema();
        db = await mongoose.connect("mongodb://mongoDB:27017/user");
        userRepositoryObject = new UserRepository(db, userSchema);


        console.log("Connected");


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
    let i = 0;

    // await manager.publishMessage("userCrud", payload);
    await manager.startConsumer(consumer);
    const message = manager.getMessage();
    // console.log("******************************************************");
    // console.log(message);
    // console.log("*******************************************************");
    // const payload = Payload.getPayload( message.functionName, message.args);

    console.log("\n");
    initCrudService(db, message);
    i++;

};

kafkaManger();

// connect();


