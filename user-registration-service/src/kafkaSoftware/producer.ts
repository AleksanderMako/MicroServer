import * as kafka from "kafka-node";



export class TestProducer {
    private client: kafka.KafkaClient;
    private producer: kafka.Producer;

    public constructor() {
        this.client = new kafka.KafkaClient({ kafkaHost: "172.17.0.1:9092" });
        const options: kafka.ProducerOptions = {
            requireAcks: 1,
            ackTimeoutMs: 100,
            partitionerType: 2
        };
        this.producer = new kafka.Producer(this.client, options);
    }

    public async start(messagesCount: number) {
        let i: number = 0;

        while (i < messagesCount) {
            try {
                // Sleep for 500 ms
                await this.sleep(500);
                const payloads: kafka.ProduceRequest[] = [{
                    topic: "userCrud",
                    messages: [i],
                    // key: (i % 3).toString()
                }];
                this.producer.send(payloads, (err, data) => {
                    if (err) {
                        console.log("Producer Error :" + err);
                    } else {
                        console.log(`message ${i} published`);
                    }
                });
                i++;

            } catch (e) {
                console.log(e);
                this.producer.close();
                break;
            }
        }
    }

    private sleep(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}
