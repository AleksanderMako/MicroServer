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
    // for demo purposes seat management is seeded with sample seats
    create(data) {
        const flight = new this.Model({
            flightNumber: data.flightNumber,
            departure: data.departure,
            destination: data.destination,
            airplaneType: data.airplaneType,
            capacity: data.capacity,
            seats: [{
                    row: 1,
                    column: "A",
                    SeatIDS: "A1",
                    status: "free"
                }, {
                    row: 1,
                    column: "B",
                    SeatIDS: "B1",
                    status: "free"
                }, {
                    row: 1,
                    column: "C",
                    SeatIDS: "C1",
                    status: "free"
                }, {
                    row: 2,
                    column: "A",
                    SeatIDS: "A2",
                    status: "free"
                }, {
                    row: 2,
                    column: "B",
                    SeatIDS: "B2",
                    status: "free"
                }]
        });
        // const error: Error = flight.validateSync();
        return new Promise((resolve, reject) => {
            flight.save((err) => {
                if (err) {
                    const flightErrorResponse = {
                        opStatus: "error",
                        hasError: true,
                        error: err,
                        data: undefined
                    };
                    console.log("ERROR Inside promise:" + err);
                    reject(flightErrorResponse);
                }
                else {
                    const flightSuccessResponse = {
                        opStatus: "success",
                        hasError: false,
                        error: undefined,
                        data: undefined
                    };
                    resolve(flightSuccessResponse);
                    console.log("INFO:Success");
                }
            });
        });
    }
    readAll() {
        return new Promise((resolve, reject) => {
            this.Model.find({}, (err, users) => {
                if (err) {
                    const flightErrorResponse = {
                        opStatus: "error",
                        hasError: true,
                        error: err,
                        data: undefined
                    };
                    reject(flightErrorResponse);
                }
                else {
                    const flightSuccessResponse = {
                        opStatus: "success",
                        hasError: false,
                        error: undefined,
                        data: users
                    };
                    resolve(flightSuccessResponse);
                }
            });
        });
    }
    readOne(data) {
        return new Promise((resolve, reject) => {
            this.Model.findOne({ "flightNumber": `${data.flightNumber}` }, (err, user) => {
                if (err) {
                    const flightErrorResponse = {
                        opStatus: "error",
                        hasError: true,
                        error: err,
                        data: undefined
                    };
                    reject(flightErrorResponse);
                }
                else {
                    const flightSuccessResponse = {
                        opStatus: "success",
                        hasError: false,
                        error: undefined,
                        data: user
                    };
                    resolve(user);
                }
            });
        });
    }
    update(data) {
        return new Promise((resolve, reject) => {
            this.Model.findOneAndUpdate({
                "flightNumber": data.flightNumber
            }, {
                $set: {
                    departure: data.departure,
                    destination: data.destination,
                    airplaneType: data.airplaneType,
                    capacity: data.capacity
                }
            }, {
                runValidators: true,
                new: true
            }, (err, document) => {
                if (err) {
                    const flightErrorResponse = {
                        opStatus: "error",
                        hasError: true,
                        error: err,
                        data: undefined
                    };
                    reject(flightErrorResponse);
                }
                else {
                    const flightSuccessResponse = {
                        opStatus: "success",
                        hasError: false,
                        error: undefined,
                        data: document
                    };
                    resolve(flightSuccessResponse);
                }
            });
        });
    }
    delete(data) {
        return new Promise((resolve, reject) => {
            this.Model.findOneAndRemove({ "flightNumber": data.flightNumber }, (err, document) => {
                if (err) {
                    const flightErrorResponse = {
                        opStatus: "error",
                        hasError: true,
                        error: err,
                        data: undefined
                    };
                    reject(flightErrorResponse);
                }
                else {
                    const flightSuccessResponse = {
                        opStatus: "success",
                        hasError: false,
                        error: undefined,
                        data: document
                    };
                    resolve(flightSuccessResponse);
                }
            });
        });
    }
    seedSeats() {
    }
}
exports.default = FlightRepository;
//# sourceMappingURL=flightsRepository.js.map