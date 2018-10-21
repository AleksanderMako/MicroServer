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
        this.flightPayload = JSON.parse(data.flight);
        const reservation = new this.Model({
            flightNumber: this.flightPayload.flightNumber,
            username: this.userPayload.username,
            seatNumber: data.seatNumber
        });
        return new Promise((resolve, reject) => {
            reservation.save((err) => {
                if (err) {
                    console.log("ERROR Inside Promise:" + err);
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
    update(data) {
        this.UpdateResrvationPayload = new updateReservationPayload_1.default(data.flightNumber, data.username);
        return new Promise((resolve, reject) => {
            this.Model.findOneAndUpdate({
                username: this.UpdateResrvationPayload.username,
                flightNumber: this.UpdateResrvationPayload.flightnumber
            }, {
                $set: {
                    seatNumber: data.seatNumber
                }
            }, { runValidators: true, new: true }, (err, document) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(document);
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
                    reject(err);
                }
                else {
                    resolve(documents);
                }
            });
        });
    }
}
exports.default = ReservationsRepository;
//# sourceMappingURL=reservationsRepository.js.map