import * as kafka from "kafka-node";


export class TestConsumer {
    private client: kafka.KafkaClient;
    private consumer: kafka.ConsumerGroup;
    private id: string;
    private groupId: string;

    public constructor(id: string, groupId: string) {
        this.id = id;
        this.groupId = groupId;

        const options: kafka.ConsumerGroupOptions = {
            kafkaHost: "172.17.0.1:9092",
            groupId: groupId,
            id: id
        };
        this.consumer = new kafka.ConsumerGroup(options, "userCrud");
        this.consumer.on("message", (message) => { this.consume(message); });
        this.consumer.on("error", (e) => { console.log(e); });
    }

    private consume(message: kafka.Message) {
        console.log("Consuming msg ");
        const data = message.value;
        // console.log(typeof data);
        // console.log(data);

        const dt = JSON.parse(data.toString());
        console.log(typeof dt);

        console.log(dt);
        console.log(dt.functionName);

        // console.log(JSON.parse(data.toString()));


        // console.log(message.value);
        console.log(`consumer: ${this.id}, key: ${message.key}, partition: ${message.partition}`);
        this.consumer.commit((err, data) => {
            if (err) {
                console.log(err);
            }
        });
    }
}
