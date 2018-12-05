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
const schema = require("../schemas/flightSchema");
const seatSchema = require("../schemas/seatSchema");
const mongoose = require("mongoose");
const flightCrud_1 = require("./flightCrud");
const flightsRepository_1 = require("../repository/flightsRepository");
const kafkaManager_1 = require("../kafkaSoftware/kafkaservices/kafkaManager");
const consumer_1 = require("../kafkaSoftware/consumer");
class FlightService {
    constructor() {
        this.KafkaServiceinit();
    }
    initCrudService() {
        const filghtCrud = new flightCrud_1.default(this.flightCrudMessage, this.flightRepository);
        filghtCrud.init();
    }
    connect() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const SeatSchema = seatSchema.makeSeatSchema();
                const flightSchema = schema.makeFlightSchema();
                const flightdb = yield mongoose.connect("mongodb://mongodbflight:27018/flights");
                // const seatTable = await mongoose.connect("mongodb://mongodbflight:27018/seats");
                this.flightRepository = new flightsRepository_1.default(flightdb, flightSchema);
                console.log("INFO:Successfully conected to mongo DB");
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
            this.consumer = this.messageManager.createConsumerObject("flightCrud", "flightCrudCid", "flighCrudGId");
            while (true) {
                yield this.messageManager.startConsumer(this.consumer);
                this.flightCrudMessage = this.messageManager.getMessage();
                console.log("\n");
                this.initCrudService();
            }
        });
    }
}
exports.default = FlightService;
//# sourceMappingURL=flight.service.js.map