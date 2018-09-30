import * as kafka from "kafka-node";
import Payload from "../payload";
import * as util from "util";


export class TestProducer {
    private client: kafka.KafkaClient;
    private producer: kafka.Producer;
    private topic: string;
    private message: Payload;
    private buffMessage: string;

    public constructor() {
        this.client = new kafka.KafkaClient({ kafkaHost: "172.17.0.1:9092" });
        const options: kafka.ProducerOptions = {
            requireAcks: 1,
            ackTimeoutMs: 100,
            partitionerType: 2
        };
        this.producer = new kafka.Producer(this.client, options);
    }

    public async start(topic: string, message: any) {
       // console.log("DEBUG: ENTERED START METHOD ");
        console.log("\n");
        this.buffMessage = JSON.stringify(message);
      ///  console.log(this.buffMessage);
        this.topic = topic;
        let messageCounter = 0;
        try {
            // Sleep for 500 ms
            await this.sleep(500);
            const payloads: kafka.ProduceRequest[] = [{
                topic: this.topic,
                messages: [this.buffMessage],
                // key: (i % 3).toString()
            }];

           // console.log("DEBUG: made the payload  ");
            console.log("\n");



            this.producer.send(payloads, (err, data) => {
                if (err) {
                    console.log("Producer Error :" + err);

                } else {
                    console.log(`message ${JSON.stringify(message)} published`);
                    console.log("\n");

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
