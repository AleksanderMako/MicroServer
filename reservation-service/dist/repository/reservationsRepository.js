"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
        this.userPayload = JSON.parse(data.user);
        this.flightPayload = JSON.parse(data.flight);
        const reservation = new this.Model({
            flightNumber: this.flightPayload.flightNumber,
            departure: this.flightPayload.departure,
            destination: this.flightPayload.destination,
            firstname: this.userPayload.firstname,
            lastname: this.userPayload.lastName,
            seatNumber: ""
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
}
exports.default = ReservationsRepository;
//# sourceMappingURL=reservationsRepository.js.map