import * as kafka from "kafka-node";
import { TestConsumer } from "../consumer";
import { TestProducer } from "../producer";


export default class KafkaManager {

    private consumerObject: TestConsumer;
    private producerObject: TestProducer;

    constructor(producer: TestProducer, consumer: TestConsumer) {

        this.producerObject = producer;
        this.consumerObject = consumer;
    }
}

