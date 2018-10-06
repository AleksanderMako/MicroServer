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
const kafka = require("kafka-node");
class TestProducer {
    constructor() {
        this.client = new kafka.KafkaClient({ kafkaHost: "172.17.0.1:9092" });
        const options = {
            requireAcks: 1,
            ackTimeoutMs: 100,
            partitionerType: 2
        };
        this.producer = new kafka.Producer(this.client, options);
    }
    start(topic, message) {
        return __awaiter(this, void 0, void 0, function* () {
            // console.log("DEBUG: ENTERED START METHOD ");
            console.log("\n");
            this.buffMessage = JSON.stringify(message);
            ///  console.log(this.buffMessage);
            this.topic = topic;
            let messageCounter = 0;
            try {
                // Sleep for 500 ms
                yield this.sleep(500);
                const payloads = [{
                        topic: this.topic,
                        messages: [this.buffMessage],
                    }];
                // console.log("DEBUG: made the payload  ");
                console.log("\n");
                this.producer.send(payloads, (err, data) => {
                    if (err) {
                        console.log("Producer Error :" + err);
                    }
                    else {
                        console.log(`message ${JSON.stringify(message)} published`);
                        console.log("\n");
                    }
                });
                messageCounter++;
            }
            catch (e) {
                console.log(e);
                this.producer.close();
            }
        });
    }
    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}
exports.TestProducer = TestProducer;
//# sourceMappingURL=producer.js.map