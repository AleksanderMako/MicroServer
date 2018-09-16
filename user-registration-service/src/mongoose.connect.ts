import * as mongoose from "mongoose";
import UserCrud from "./user.service.ts/userCrud";
import Payload from "./payload";
import { Producer } from "kafka-node";
import { TestConsumer } from "./kafkaSoftware/consumer";
import { TestProducer } from "./kafkaSoftware/producer";
import KafkaManager from "./kafkaSoftware/kafkaservices/kafkaManager";
import * as schema from "./schemas/userSchema";
let userSchema: mongoose.Schema;
const initCrudService = (connection: any, payload: Payload) => {

    const userService = new UserCrud(payload, connection, userSchema);
    userService.init();
};
let db: any;
const connect = async () => {
    try {


        userSchema = schema.makeUserSchema();
        db = await mongoose.connect("mongodb://mongoDB:27017/user", );

        console.log("Connected");


    } catch (err) {

        console.log(err);
    }
};
const kafkaManger = async () => {
    connect();

    const manager = new KafkaManager();
    manager.setProducer(new TestProducer());
    manager.setConsumer(new TestConsumer());
    const consumer = manager.createConsumerObject("userCrud", "id-1", "g-11");
    let i = 0;
    while (i < 10) {
        const payload = Payload.getPayload("create", { firstname: "hi", lastName: "there", age: 18 });
        await manager.publishMessage("userCrud", payload);
        await manager.startConsumer(consumer);
        const message = manager.getMessage();
        console.log("******************************************************");
        console.log(message);
        console.log("*******************************************************");

        console.log("\n");
        initCrudService(db, message);
        i++;
    }
};

kafkaManger();

// connect();


