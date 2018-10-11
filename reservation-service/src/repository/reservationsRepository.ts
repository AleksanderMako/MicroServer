import * as userSchema from "../schemas/ReservationSchema";
import * as mongoose from "mongoose";
import Irepository from "./Irepository";

export default class ReservationsRepository implements Irepository {

    private mongooseConection: any;
    private Model: mongoose.Model<any>;
    private userPayload: any;
    private flightPayload: any;

    constructor(mongooseConection: any, Schema: mongoose.Schema) {
        this.mongooseConection = mongooseConection;
        const ReservationSchema = Schema;
        this.Model = this.mongooseConection.model("reservation", ReservationSchema);
    }
    public setModel(model: mongoose.Model<any>) {
        this.Model = model;
    }

    public create(data: any) {
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
            reservation.save((err: Error) => {

                if (err) {
                    console.log("ERROR Inside Promise:" + err);
                    reject(err);

                } else {
                    resolve();
                    console.log("INFO:Success");

                }
            });
        });

    }

    public readAll() {

        return new Promise((resolve, reject) => {

            this.Model.find({}, (err, users) => {

                if (err) {
                    reject(err);

                } else {
                    resolve(users);
                }
            });
        });

    }

}