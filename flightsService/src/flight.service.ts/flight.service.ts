import * as schema from "../schemas/flightSchema";
import * as mongoose from "mongoose";
import FlightsCrud from "./flightCrud";
import FlightRepository from "../repository/flightsRepository";
import KafkaManager from "../kafkaSoftware/kafkaservices/kafkaManager";
import { TestConsumer } from "../kafkaSoftware/consumer";
import { Producer, ConsumerGroup } from "kafka-node";


export default class FlightService {

    private flightRepository: FlightRepository;

    private messageManager: KafkaManager;
    private consumer: ConsumerGroup;
    private flightCrudMessage: any;
    constructor() {
        this.KafkaServiceinit();
    }
    public initCrudService() {
        const filghtCrud = new FlightsCrud(this.flightCrudMessage, this.flightRepository);
        filghtCrud.init();
    }

    public async connect() {
        try {
            const flightSchema = schema.makeFlightSchema();
            const flightdb = await mongoose.connect("mongodb://mongodbflight:27018/flights");
            this.flightRepository = new FlightRepository(flightdb, flightSchema);
            console.log("INFO:Successfully conected to mongo DB");
        } catch (Error) {
            console.log("Error:while connection " + Error);
        }
    }

    public async KafkaServiceinit() {
        await this.connect();

        this.messageManager = new KafkaManager();
        this.messageManager.setConsumer(new TestConsumer());
        this.consumer = this.messageManager.createConsumerObject("flightCrud", "flightCrudCid", "flighCrudGId");
        while (true) {

            await this.messageManager.startConsumer(this.consumer);

            this.flightCrudMessage = this.messageManager.getMessage();
            console.log("\n");

            this.initCrudService();
        }
    }
}