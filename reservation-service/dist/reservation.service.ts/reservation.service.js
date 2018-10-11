"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const schema = require("../schemas/ReservationSchema");
const mongoose = require("mongoose");
const ReservationCrud_1 = require("./ReservationCrud");
const reservationsRepository_1 = require("../repository/reservationsRepository");
const kafkaManager_1 = require("../kafkaSoftware/kafkaservices/kafkaManager");
const consumer_1 = require("../kafkaSoftware/consumer");
class ReservationService {
    constructor() {
        this.KafkaServiceinit();
    }
    initCrudService() {
        const filghtCrud = new ReservationCrud_1.default(this.ReservationCrudMessage, this.reservationtRepository);
        filghtCrud.init();
    }
    connect() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const reservationSchema = schema.makeReservationSchema();
                const reservationtdb = yield mongoose.connect("mongodb://mongodb_reservation:27019/reservations");
                this.reservationtRepository = new reservationsRepository_1.default(reservationtdb, reservationSchema);
                console.log("INFO:Successfully connected to mongo DB");
            }
            catch (Error) {
                console.log("Error:while connection " + Error);
            }
        });
    }
    KafkaServiceinit() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.connect();
            this.messageManager = new kafkaManager_1.default();
            this.messageManager.setConsumer(new consumer_1.TestConsumer());
            this.consumer = this.messageManager.createConsumerObject("reservations", "reservationsCrudCid", "reservationsCrudGId");
            while (true) {
                yield this.messageManager.startConsumer(this.consumer);
                this.ReservationCrudMessage = this.messageManager.getMessage();
                console.log("\n");
                this.initCrudService();
            }
        });
    }
}
exports.default = ReservationService;
//# sourceMappingURL=reservation.service.js.map