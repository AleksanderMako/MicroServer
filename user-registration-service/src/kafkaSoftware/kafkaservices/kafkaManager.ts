import * as kafka from "kafka-node";
import { TestConsumer } from "../consumer";
import { TestProducer } from "../producer";
import Payload from "../../payload";


export default class KafkaManager {

    private consumerObject: TestConsumer;
    private producerObject: TestProducer;

    constructor() {

    }

    public setProducer(producer: TestProducer) {

        this.producerObject = producer;
    }
    public setConsumer(consumer: TestConsumer) {

        this.consumerObject = consumer;
    }

    public async publishMessage(topic: string, message: Payload) {

        await this.producerObject.start(topic, message);
    }
    public createConsumerObject(topic: string, id: string, groupId: string) {
        const cs = this.consumerObject.makeConsumer(topic, id, groupId);
        return cs;

    }
    public async startConsumer(consumer: kafka.ConsumerGroup) {
        await this.consumerObject.startConsumer(consumer);

    }
    public getMessage() {
        return this.consumerObject.getmessage();
    }

}

