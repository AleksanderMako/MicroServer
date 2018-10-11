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
class FlightsCrud {
    constructor(payload, flightRepositoryObject) {
        this.payload = payload_1.default.getPayload(payload.functionName, payload.args);
        this.flightRepo = flightRepositoryObject;
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
                this.create(this.payload.getArguments());
                break;
            case "read":
                console.log("INFO: read Method activated ");
                console.log("\n ");
                console.log("\n ");
                this.read();
                break;
            case "readOne":
                console.log("INFO: readOne Method activated ");
                console.log("\n ");
                console.log("\n ");
                this.readOne(this.payload.getArguments());
                break;
            case "update":
                console.log("INFO: update Method activated ");
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
        return this.flightRepo.create(args)
            .then(() => __awaiter(this, void 0, void 0, function* () {
            yield this.KafkaManager.publishMessage("flightCrudResponse", { successStatus: "success" });
        }))
            .catch((err) => __awaiter(this, void 0, void 0, function* () {
            console.log("Error in crud: " + err);
            yield this.KafkaManager.publishMessage("flightCrudResponse", { successStatus: JSON.stringify(err) });
        }));
        // TODO:change the topic for flights publishing
    }
    read() {
        return __awaiter(this, void 0, void 0, function* () {
            const flights = yield this.flightRepo.readAll();
            yield this.KafkaManager.publishMessage("flightCrudResponse", { successStatus: JSON.stringify(flights) });
            console.log(flights);
        });
    }
    readOne(args) {
        return __awaiter(this, void 0, void 0, function* () {
            const flight = yield this.flightRepo.readOne(args);
            yield this.KafkaManager.publishMessage("flightCrudResponse", { successStatus: JSON.stringify(flight) });
            console.log(flight);
        });
    }
}
exports.default = FlightsCrud;
//# sourceMappingURL=flightCrud.js.map