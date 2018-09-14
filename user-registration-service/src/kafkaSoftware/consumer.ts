import * as kafka from "kafka-node";


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
    public async startConsumer(consumer: kafka.ConsumerGroup) {
        consumer.on("message", (message) => {
            this.consume(message);
        });
        consumer.on("error", (e) => { console.log(e); });

    }
    private consume(message: kafka.Message) {
        console.log("Consuming msg ");
        console.log("\n");

        const data = message.value;

        const dt = JSON.parse(data.toString());
        console.log(typeof dt);
        console.log("\n");

        // console.log( dt);


        console.log(`consumer: ${this.id}, key: ${message.key}, partition: ${message.partition}`);
        console.log("\n");

        this.consumer.commit((err, data) => {
            if (err) {
                console.log(err);
                console.log("\n");

            } else {
                this.messageObject = dt;
            }
        });
    }

    public getmessage() {
        return this.messageObject;
    }
}
