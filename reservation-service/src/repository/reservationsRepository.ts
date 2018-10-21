import * as userSchema from "../schemas/ReservationSchema";
import * as mongoose from "mongoose";
import Irepository from "./Irepository";
import UpdateReservationPayload from "../types/updateReservationPayload";

export default class ReservationsRepository implements Irepository {

    private mongooseConection: any;
    private Model: mongoose.Model<any>;
    private userPayload: any;
    private flightPayload: any;
    private UpdateResrvationPayload: UpdateReservationPayload;

    constructor(mongooseConection: any, Schema: mongoose.Schema) {
        this.mongooseConection = mongooseConection;
        const ReservationSchema = Schema;
        this.Model = this.mongooseConection.model("reservation", ReservationSchema);
    }
    public setModel(model: mongoose.Model<any>) {
        this.Model = model;
    }

    public create(data: any) {
        console.log(data.seatNumber);
        this.userPayload = JSON.parse(data.user);
        this.flightPayload = JSON.parse(data.flight);
        const reservation = new this.Model({
            flightNumber: this.flightPayload.flightNumber,
            username: this.userPayload.username,
            seatNumber: data.seatNumber
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

    public update(data: any) {
        this.UpdateResrvationPayload = new UpdateReservationPayload​​(data.flightNumber, data.username);
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
                    } else {
                        resolve(document);
                    }
                });
        });

    }


    public findCustomersInFlight(data: any) {
        const query = this.Model.find()
            .where("flightNumber").equals(data.flightNumber);

        query.select("username -_id");
        return new Promise((resolve, reject) => {

            query.exec((err, documents) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(documents);
                }
            });
        });
    }

}