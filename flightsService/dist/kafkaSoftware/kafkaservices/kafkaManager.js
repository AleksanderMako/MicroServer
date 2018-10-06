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
class KafkaManager {
    constructor() {
    }
    setProducer(producer) {
        this.producerObject = producer;
    }
    setConsumer(consumer) {
        this.consumerObject = consumer;
    }
    publishMessage(topic, message) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.producerObject.start(topic, message);
        });
    }
    createConsumerObject(topic, id, groupId) {
        const cs = this.consumerObject.makeConsumer(topic, id, groupId);
        return cs;
    }
    startConsumer(consumer) {
        return __awaiter(this, void 0, void 0, function* () {
            this.msg = yield this.consumerObject.startConsumer(consumer);
            this.consumerObject.consume(this.msg);
        });
    }
    getMessage() {
        return this.consumerObject.getmessage();
    }
}
exports.default = KafkaManager;
//# sourceMappingURL=kafkaManager.js.map