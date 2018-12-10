"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const updateReservationPayload_1 = require("../types/updateReservationPayload");
class ReservationsRepository {
    constructor(mongooseConection, Schema) {
        this.mongooseConection = mongooseConection;
        const ReservationSchema = Schema;
        this.Model = this.mongooseConection.model("reservation", ReservationSchema);
    }
    setModel(model) {
        this.Model = model;
    }
    create(data) {
        console.log(data.seatNumber);
        this.userPayload = JSON.parse(data.user);
        console.log(JSON.stringify(this.userPayload));
        this.flightPayload = JSON.parse(data.flight);
        console.log(JSON.stringify(this.flightPayload));
        const reservation = new this.Model({
            flightNumber: this.flightPayload.flightNumber,
            username: this.userPayload.data.username,
            seatNumber: data.seatNumber,
            Departure: this.flightPayload.departure,
            Destination: this.flightPayload.destination,
            Date: this.flightPayload.Date,
            firstname: this.userPayload.data.firstname,
            lastName: this.userPayload.data.lastName
        });
        return new Promise((resolve, reject) => {
            reservation.save((err) => {
                if (err) {
                    const errResponse = {
                        opStatus: "error",
                        hasError: true,
                        error: err,
                        data: "success"
                    };
                    console.log("ERROR Inside Promise:" + err);
                    reject(errResponse);
                }
                else {
                    const successResponse = {
                        opStatus: "success",
                        hasError: false,
                        error: undefined,
                        data: undefined
                    };
                    resolve(successResponse);
                    console.log("INFO:Success");
                }
            });
        });
    }
    readAll() {
        return new Promise((resolve, reject) => {
            this.Model.find({}, (err, users) => {
                if (err) {
                    const errResponse = {
                        opStatus: "error",
                        hasError: true,
                        error: err,
                        data: undefined
                    };
                    reject(errResponse);
                }
                else {
                    const successResponse = {
                        opStatus: "success",
                        hasError: false,
                        error: undefined,
                        data: users
                    };
                    resolve(successResponse);
                }
            });
        });
    }
    findUserReservations(data) {
        return new Promise((resolve, reject) => {
            this.Model
                .find({ "username": data.username }, (err, documents) => {
                if (err) {
                    const errResponse = {
                        opStatus: "error",
                        hasError: true,
                        error: err,
                        data: undefined
                    };
                    reject(errResponse);
                }
                else {
                    const successResponse = {
                        opStatus: "success",
                        hasError: false,
                        error: undefined,
                        data: documents
                    };
                    resolve(successResponse);
                }
            });
        });
    }
    update(data) {
        this.UpdateResrvationPayload = new updateReservationPayload_1.default(data.flightNumber, data.username);
        console.log("Update many called with data to update : ");
        console.log(JSON.stringify(data.update));
        console.log("condition  : ");
        console.log(JSON.stringify(data.query));
        return new Promise((resolve, reject) => {
            this.Model.updateMany(data.query, { $set: data.update }, { multi: true }, (err, documents) => {
                if (err) {
                    const errResponse = {
                        opStatus: "error",
                        hasError: true,
                        error: err,
                        data: undefined
                    };
                    reject(errResponse);
                }
                else {
                    const successResponse = {
                        opStatus: "success",
                        hasError: false,
                        error: undefined,
                        data: documents
                    };
                    resolve(successResponse);
                }
            });
        });
    }
    // this.Model.find(data.query, (err, document) => {
    //     if (err) {
    //         const errResponse: ReserveCrudDTO = {
    //             opStatus: "error",
    //             hasError: true,
    //             error: err,
    //             data: undefined
    //         };
    //         reject(errResponse);
    //     } else {
    //         for (let i = 0; i < document.length; i++) {
    //             this.Model.update()
    //         }
    //         const successResponse: ReserveCrudDTO = {
    //             opStatus: "success",
    //             hasError: false,
    //             error: undefined,
    //             data: document
    //         };
    //         resolve(successResponse);
    //     }
    // });
    //     })
    // }
    removeReservationBYCustomer(data) {
        return new Promise((resolve, reject) => {
            this.Model
                .find({ "username": data.username })
                .remove((err) => {
                if (err) {
                    const errResponse = {
                        opStatus: "error",
                        hasError: true,
                        error: err,
                        data: undefined
                    };
                    reject(errResponse);
                }
                else {
                    const successResponse = {
                        opStatus: "success",
                        hasError: false,
                        error: undefined,
                        data: undefined
                    };
                    console.log("Successfully removed reservations for customer ");
                    resolve(successResponse);
                }
            });
        });
    }
    findCustomersInFlight(data) {
        const query = this.Model.find()
            .where("flightNumber").equals(data.flightNumber);
        query.select("username -_id");
        return new Promise((resolve, reject) => {
            query.exec((err, documents) => {
                if (err) {
                    const errResponse = {
                        opStatus: "error",
                        hasError: true,
                        error: err,
                        data: undefined
                    };
                    reject(errResponse);
                }
                else {
                    const successResponse = {
                        opStatus: "success",
                        hasError: false,
                        error: undefined,
                        data: documents
                    };
                    resolve(successResponse);
                }
            });
        });
    }
}
exports.default = ReservationsRepository;
//# sourceMappingURL=reservationsRepository.js.map