import * as kafka from "kafka-node";
import { resolve } from "dns";


export class TestConsumer {
    private client: kafka.KafkaClient;
    private consumer: kafka.ConsumerGroup;
    private id: string;
    private groupId: string;
    private options: kafka.ConsumerGroupOptions;
    private messageObject: any;
    public constructor() {

    }
    public makeConsumer(topic: string, id: string, groupId: string) {
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
    public  startConsumer(consumer: kafka.ConsumerGroup) {
        return new Promise((resolve, reject) => {
            consumer.on("message", (message) => {

               // resolve(message);
                resolve(message);
            });
            consumer.on("error", (e) => { reject(e); });
        });




    }
    public consume(message: kafka.Message) {
        console.log("Consuming msg ");
        console.log("\n");

        const data = message.value;

        const dt = JSON.parse(data.toString());
       /// console.log(typeof dt);
        console.log("\n");

        console.log(dt);
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

    public getmessage() {

        return this.messageObject;

    }
}
