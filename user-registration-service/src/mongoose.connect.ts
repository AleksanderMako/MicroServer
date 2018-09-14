import * as mongoose from "mongoose";
import UserCrud from "./user.service.ts/userCrud";
import Payload from "./payload";
import { Producer } from "kafka-node";
import { TestConsumer } from "./kafkaSoftware/consumer";
import { TestProducer } from "./kafkaSoftware/producer";
import KafkaManager from "./kafkaSoftware/kafkaservices/kafkaManager";

const initCrudService = (connection: any, payload: Payload) => {

    const userService = new UserCrud(payload, connection);
    userService.init();
};

const connect = async (data: any) => {
    try {

        const db = await mongoose.connect("mongodb://mongoDB:27017/user", );
        initCrudService(db, data);
        console.log("Connected");


    } catch (err) {

        console.log(err);
    }
};
const kafkaManger = async () => {
    const manager = new KafkaManager();
    const payload = Payload.getPayload("create", { firstname: "hi", lastName: "there", age: 18 });
    manager.setProducer(new TestProducer());
    manager.setConsumer(new TestConsumer());
    const consumer = manager.createConsumerObject("userCrud", "id-1", "g-11");
    await manager.publishMessage("userCrud", payload);
    await manager.startConsumer(consumer);
    const message = manager.getMessage();
    console.log(message);
    console.log("\n");

    connect(message);
};

kafkaManger();

// connect();


