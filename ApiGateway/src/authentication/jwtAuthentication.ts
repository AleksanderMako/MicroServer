import * as dotenv from "dotenv";
dotenv.config();

import * as passport from "passport";
import * as passportjwt from "passport-jwt";
import Payload from "../payload";
import KafkaManager from "../kafkaSoftware/kafkaservices/kafkaManager";
import { TestConsumer } from "../kafkaSoftware/consumer";
import { TestProducer } from "../kafkaSoftware/producer";

const jwtStrategy = passportjwt.Strategy;
const ExtractJwt = passportjwt.ExtractJwt;
const kafkaManger = new KafkaManager();
kafkaManger.setConsumer(new TestConsumer());
kafkaManger.setProducer(new TestProducer());
const consumer = kafkaManger.createConsumerObject("userCrud", "loginConsumer", "loginG1");
const opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: "process.env.SECRET"
};
export const strategy = new jwtStrategy(opts, async (payload, next) => {
    // TODO get user from db
    console.log("********************************************************************************************");
    console.log("jwt protection activated ");

    const args = {
        username: payload.args.username,
    };
    const queryPayload = Payload.getPayload("readOne", args);
    await kafkaManger.publishMessage("userCrud", queryPayload);
    await kafkaManger.startConsumer(consumer);
    const user = kafkaManger.getMessage();
    console.log("jwt protection finished ");
    // TODO: pass err when user not found
    console.log("********************************************************************************************");

    next(null, payload);
});