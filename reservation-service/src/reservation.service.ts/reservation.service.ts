import * as schema from "../schemas/ReservationSchema";
import * as mongoose from "mongoose";
import ReservationCrud from "./ReservationCrud";
import ReservationsRepository from "../repository/reservationsRepository";
import KafkaManager from "../kafkaSoftware/kafkaservices/kafkaManager";
import { TestConsumer } from "../kafkaSoftware/consumer";
import { Producer, ConsumerGroup } from "kafka-node";


export default class ReservationService {

    private reservationtRepository: ReservationsRepository;

    private messageManager: KafkaManager;
    private consumer: ConsumerGroup;
    private ReservationCrudMessage: any;
    constructor() {
        this.KafkaServiceinit();
    }
    public initCrudService() {
        const filghtCrud = new ReservationCrud(this.ReservationCrudMessage, this.reservationtRepository);
        filghtCrud.init();
    }

    public async connect() {
        try {
            const reservationSchema = schema.makeReservationSchema();
            const reservationtdb = await mongoose.connect("mongodb://mongodb_reservation:27019/reservations");
            this.reservationtRepository = new ReservationsRepository(reservationtdb, reservationSchema);
            console.log("INFO:Successfully connected to mongo DB");
        } catch (Error) {
            console.log("Error:while connection " + Error);
        }
    }

    public async KafkaServiceinit() {
        await this.connect();

        this.messageManager = new KafkaManager();
        this.messageManager.setConsumer(new TestConsumer());
        this.consumer = this.messageManager.createConsumerObject("reservations", "reservationsCrudCid", "reservationsCrudGId");
        while (true) {

            await this.messageManager.startConsumer(this.consumer);

            this.ReservationCrudMessage = this.messageManager.getMessage();
            console.log("\n");

            this.initCrudService();
        }
    }
}