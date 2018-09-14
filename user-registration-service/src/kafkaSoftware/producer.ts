import * as kafka from "kafka-node";
import Payload from "../payload";



export class TestProducer {
    private client: kafka.KafkaClient;
    private producer: kafka.Producer;
    private topic: string;
    private message: Payload;
    private buffMessage: string;

    public constructor(topic: string, message: Payload) {
        this.client = new kafka.KafkaClient({ kafkaHost: "172.17.0.1:9092" });
        const options: kafka.ProducerOptions = {
            requireAcks: 1,
            ackTimeoutMs: 100,
            partitionerType: 2
        };
        this.producer = new kafka.Producer(this.client, options);
        this.topic = topic;
        this.message = message;
        this.buffMessage = JSON.stringify(this.message);
    }

    public async start(messagesCount: number) {

        let messageCounter = 0;
        try {
            // Sleep for 500 ms
            await this.sleep(500);
            const payloads: kafka.ProduceRequest[] = [{
                topic: this.topic,
                messages: [this.buffMessage],
                // key: (i % 3).toString()
            }];


            this.producer.send(payloads, (err, data) => {
                if (err) {
                    console.log("Producer Error :" + err);
                } else {
                    console.log(`message ${JSON.stringify(this.message)} published`);
                }
            });


            messageCounter++;

        } catch (e) {
            console.log(e);
            this.producer.close();

        }

    }

    private sleep(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}
