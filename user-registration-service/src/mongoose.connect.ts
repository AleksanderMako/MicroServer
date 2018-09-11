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

const startKafka = async () => {

    const producer = new TestProducer();
    producer.start(100);
    // const emitter = new EventEmitter();
    // emitter.setMaxListeners(30);
   // const consumer = new TestConsumer("id1", "g3");
};
startKafka();

// connect();


