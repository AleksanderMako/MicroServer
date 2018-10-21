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
const payload_1 = require("../payload");
const kafkaManager_1 = require("../kafkaSoftware/kafkaservices/kafkaManager");
const producer_1 = require("../kafkaSoftware/producer");
class ReservationssCrud {
    constructor(payload, reservationRepositoryObject) {
        this.payload = payload_1.default.getPayload(payload.functionName, payload.args);
        this.reservationRepo = reservationRepositoryObject;
        this.KafkaManager = new kafkaManager_1.default();
        this.KafkaManager.setProducer(new producer_1.TestProducer());
    }
    init() {
        this.functionName = this.payload.getFucnName();
        switch (this.functionName) {
            case "create":
                console.log("INFO: Create Method activated ");
                console.log("\n ");
                console.log("\n ");
                console.log("INFO: Recieved payload:" + this.payload.getArguments());
                this.create(this.payload.getArguments());
                break;
            case "read":
                console.log("INFO: read Method activated ");
                console.log("\n ");
                console.log("\n ");
                this.read();
                break;
            case "update":
                console.log("INFO: update Method activated ");
                this.update(this.payload.getArguments());
                break;
            case "readCustomers":
                this.readCustomersPerFlight(this.payload.getArguments());
                break;
            case "delete":
                console.log("INFO: delete Method activated ");
                break;
            default:
                console.log("No method invoked here ");
                break;
        }
    }
    create(args) {
        return this.reservationRepo.create(args)
            .then(() => __awaiter(this, void 0, void 0, function* () {
            yield this.KafkaManager.publishMessage("reservationResponse", { successStatus: "success" });
        }))
            .catch((err) => __awaiter(this, void 0, void 0, function* () {
            yield this.KafkaManager.publishMessage("reservationResponse", { successStatus: JSON.stringify(err) });
        }));
        // TODO:change the topic for flights publishing
    }
    read() {
        return __awaiter(this, void 0, void 0, function* () {
            const reservations = yield this.reservationRepo.readAll();
            yield this.KafkaManager.publishMessage("reservationResponse", { successStatus: JSON.stringify(reservations) });
            console.log(reservations);
        });
    }
    update(data) {
        return this.reservationRepo.update(data)
            .then((document) => __awaiter(this, void 0, void 0, function* () {
            yield this.KafkaManager.publishMessage("reservationResponse", { successStatus: JSON.stringify(document) });
        }))
            .catch((err) => __awaiter(this, void 0, void 0, function* () {
            yield this.KafkaManager.publishMessage("reservationResponse", { successStatus: JSON.stringify(err) });
        }));
    }
    readCustomersPerFlight(data) {
        return this.reservationRepo.findCustomersInFlight(data)
            .then((users_in_flight) => __awaiter(this, void 0, void 0, function* () {
            yield this.KafkaManager.publishMessage("reservationResponse", { successStatus: JSON.stringify(users_in_flight) });
        }))
            .catch((err) => __awaiter(this, void 0, void 0, function* () {
            yield this.KafkaManager.publishMessage("reservationResponse", { successStatus: JSON.stringify(err) });
        }));
    }
}
exports.default = ReservationssCrud;
//# sourceMappingURL=ReservationCrud.js.map