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
const kafkaManager_1 = require("./kafkaSoftware/kafkaservices/kafkaManager");
const initCrudService = (connection, payload) => {
    const userService = new userCrud_1.default(payload, connection);
    userService.init();
};
const connect = (data) => __awaiter(this, void 0, void 0, function* () {
    try {
        const db = yield mongoose.connect("mongodb://mongoDB:27017/user");
        initCrudService(db, data);
        console.log("Connected");
    }
    catch (err) {
        console.log(err);
    }
});
const kafkaManger = () => __awaiter(this, void 0, void 0, function* () {
    const manager = new kafkaManager_1.default();
    const payload = payload_1.default.getPayload("create", { firstname: "hi", lastName: "there", age: 18 });
    manager.setProducer(new producer_1.TestProducer());
    manager.setConsumer(new consumer_1.TestConsumer());
    const consumer = manager.createConsumerObject("userCrud", "id-1", "g-11");
    yield manager.publishMessage("userCrud", payload);
    yield manager.startConsumer(consumer);
    const message = manager.getMessage();
    console.log("******************************************************");
    console.log(message);
    console.log("*******************************************************");
    console.log("\n");
    connect(message);
});
kafkaManger();
// connect();
//# sourceMappingURL=mongoose.connect.js.map