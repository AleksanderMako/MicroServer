import * as kafka from "kafka-node";
import { TestConsumer } from "../consumer";
import { TestProducer } from "../producer";
import Payload from "../../payload";


export default class KafkaManager {

    private consumerObject: TestConsumer;
    private producerObject: TestProducer;
    private msg: any;
    private data: any;
    constructor() {

    }

    public setProducer(producer: TestProducer) {

        this.producerObject = producer;
    }
    public setConsumer(consumer: TestConsumer) {

        this.consumerObject = consumer;
    }

    public async publishMessage(topic: string, message: any) {

        await this.producerObject.start(topic, message);
    }
    public createConsumerObject(topic: string, id: string, groupId: string) {
        const cs = this.consumerObject.makeConsumer(topic, id, groupId);
        return cs;

    }
    public async startConsumer(consumer: kafka.ConsumerGroup) {
        this.msg = await this.consumerObject.startConsumer(consumer);
         this.consumerObject.consume(this.msg);
    }
    public getData() {
        return this.data;
    }
    public getMessage() {
        return this.consumerObject.getmessage();
    }

}

