"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const kafka = require("kafka-node");
class TestConsumer {
    constructor() {
    }
    makeConsumer(topic, id, groupId) {
        this.id = id;
        this.groupId = groupId;
        this.options = {
            kafkaHost: "172.17.0.1:9092",
            groupId: groupId,
            id: id
        };
        this.consumer = new kafka.ConsumerGroup(this.options, topic);
        return this.consumer;
    }
    startConsumer(consumer) {
        return new Promise((resolve, reject) => {
            consumer.on("message", (message) => {
                resolve(message);
            });
            consumer.on("error", (e) => { reject(e); });
        });
    }
    consume(message) {
        console.log("Consuming msg ");
        console.log("\n");
        const data = message.value;
        const dt = JSON.parse(data.toString());
        /// console.log(typeof dt);
        console.log("\n");
        // console.log(dt);
        this.messageObject = dt;
        console.log(`consumer: ${this.id}, key: ${message.key}, partition: ${message.partition}`);
        console.log("\n");
        this.consumer.commit((err, data) => {
            if (err) {
                console.log(err);
                console.log("\n");
            }
        });
    }
    getmessage() {
        return this.messageObject;
    }
}
exports.TestConsumer = TestConsumer;
//# sourceMappingURL=consumer.js.map