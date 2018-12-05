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
const consumer_1 = require("./kafkaSoftware/consumer");
const producer_1 = require("./kafkaSoftware/producer");
const kafkaManager_1 = require("./kafkaSoftware/kafkaservices/kafkaManager");
const schema = require("./schemas/userSchema");
const userRepository_1 = require("./repository/userRepository");
let db;
let userSchema;
let userRepositoryObject;
let userService;
const initCrudService = (connection, payload) => {
    // init should be taking the payload
    userService.init(payload);
};
const connect = () => __awaiter(this, void 0, void 0, function* () {
    try {
        userSchema = schema.makeUserSchema();
        db = yield mongoose.connect("mongodb://mongoDB:27017/user");
        console.log("Connected");
        userRepositoryObject = new userRepository_1.default(db, userSchema);
        userService = new userCrud_1.default(userRepositoryObject);
    }
    catch (err) {
        console.log(err);
    }
});
const kafkaManger = () => __awaiter(this, void 0, void 0, function* () {
    connect();
    const arr = ["", "create", "read"];
    const manager = new kafkaManager_1.default();
    manager.setProducer(new producer_1.TestProducer());
    manager.setConsumer(new consumer_1.TestConsumer());
    const consumer = manager.createConsumerObject("userCrud", "id-1", "g-11");
    let i = 0;
    // await manager.publishMessage("userCrud", payload);
    while (true) {
        yield manager.startConsumer(consumer);
        const message = manager.getMessage();
        // console.log("******************************************************");
        // console.log(message);
        // console.log("*******************************************************");
        // const payload = Payload.getPayload( message.functionName, message.args);
        console.log("\n");
        initCrudService(db, message);
    }
    i++;
});
kafkaManger();
// connect();
//# sourceMappingURL=mongoose.connect.js.map