"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const userCrud_1 = require("./user.service.ts/userCrud");
const payload_1 = require("./payload");
const consumer_1 = require("./kafkaSoftware/consumer");
const producer_1 = require("./kafkaSoftware/producer");
const initCrudService = (connection) => {
    const payload = payload_1.default.getPayload("create", { firstname: "hi", lastName: "there", age: 18 });
    const userService = new userCrud_1.default(payload, connection);
    userService.init();
};
const connect = () => __awaiter(this, void 0, void 0, function* () {
    try {
        const db = yield mongoose.connect("mongodb://mongoDB:27017/user");
        initCrudService(db);
        console.log("Connected");
    }
    catch (err) {
        console.log(err);
    }
});
const startKafkaConsumer = () => __awaiter(this, void 0, void 0, function* () {
    const consumer = new consumer_1.TestConsumer("id1", "g3");
});
const startKafkaPriducer = () => __awaiter(this, void 0, void 0, function* () {
    const producer = new producer_1.TestProducer("userCrud", new payload_1.default("create", { firstname: "Alex", lastName: "kafkaMan" }));
    producer.start(10);
    // const consumer = new TestConsumer("id1", "g3");
});
startKafkaPriducer();
startKafkaConsumer();
// connect();
//# sourceMappingURL=mongoose.connect.js.map