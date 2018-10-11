"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class FlightRepository {
    constructor(mongooseConection, Schema) {
        this.mongooseConection = mongooseConection;
        const flightSchema = Schema;
        this.Model = this.mongooseConection.model("flight", flightSchema);
    }
    setModel(model) {
        this.Model = model;
    }
    create(data) {
        const flight = new this.Model({
            flightNumber: data.flightNumber,
            departure: data.departure,
            destination: data.destination,
            airplaneType: data.airplaneType,
            capacity: data.capacity
        });
        // const error: Error = flight.validateSync();
        return new Promise((resolve, reject) => {
            flight.save((err) => {
                if (err) {
                    console.log("ERROR Inside promise:" + err);
                    reject(err);
                }
                else {
                    resolve();
                    console.log("INFO:Success");
                }
            });
        });
    }
    readAll() {
        return new Promise((resolve, reject) => {
            this.Model.find({}, (err, users) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(users);
                }
            });
        });
    }
    readOne(data) {
        return new Promise((resolve, reject) => {
            this.Model.findOne({ "flightNumber": `${data.flightid}` }, (err, user) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(user);
                }
            });
        });
    }
}
exports.default = FlightRepository;
//# sourceMappingURL=flightsRepository.js.map