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
            kafkaHost: "192.168.8.100:9092",
            groupId: groupId,
            id: id
         };
        this.consumer = new kafka.ConsumerGroup(options, "userCrud");
        this.consumer.on("message", (message) => { this.consume(message); });
        this.consumer.on("error", (e) => { console.log(e); });
    }

    private consume(message: kafka.Message) {
        console.log(`consumer: ${this.id}, key: ${message.key}, partition: ${message.partition}, value: ${message.value}`);
        this.consumer.commit((err, data) => {
            if (err) {
                console.log(err);
            }
        });
    }
}
