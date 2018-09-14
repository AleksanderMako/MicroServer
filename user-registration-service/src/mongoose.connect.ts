import * as mongoose from "mongoose";
import UserCrud from "./user.service.ts/userCrud";
import Payload from "./payload";
import { Producer } from "kafka-node";
import { TestConsumer } from "./kafkaSoftware/consumer";
import { TestProducer } from "./kafkaSoftware/producer";

const initCrudService = (connection: any) => {

    const payload = Payload.getPayload("create", { firstname: "hi", lastName: "there", age: 18 });
    const userService = new UserCrud(payload, connection);
    userService.init();
};

const connect = async () => {
    try {

        const db = await mongoose.connect("mongodb://mongoDB:27017/user", );
        initCrudService(db);
        console.log("Connected");


    } catch (err) {

        console.log(err);
    }
};
const startKafkaConsumer = async () => {

    const consumer = new TestConsumer("id1", "g3");

};
const startKafkaPriducer = async () => {

    const producer = new TestProducer("userCrud", new Payload("create", { firstname: "Alex", lastName: "kafkaMan" }));
    producer.start(10);
    // const consumer = new TestConsumer("id1", "g3");
};
startKafkaPriducer();
startKafkaConsumer();

// connect();


