import * as userSchema from "../schemas/ReservationSchema";
import * as mongoose from "mongoose";
import Irepository from "./Irepository";
import UpdateReservationPayload from "../types/updateReservationPayload";
import ReserveCrudDTO from "../DTOs/reservationDTO";

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
            reservation.save((err: Error) => {

                if (err) {
                    const errResponse: ReserveCrudDTO = {
                        opStatus: "error",
                        hasError: true,
                        error: err,
                        data: "success"
                    };
                    console.log("ERROR Inside Promise:" + err);
                    reject(errResponse);

                } else {
                    const successResponse: ReserveCrudDTO = {
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

    public readAll() {

        return new Promise((resolve, reject) => {

            this.Model.find({}, (err, users) => {

                if (err) {
                    const errResponse: ReserveCrudDTO = {
                        opStatus: "error",
                        hasError: true,
                        error: err,
                        data: undefined
                    };
                    reject(errResponse);

                } else {
                    const successResponse: ReserveCrudDTO = {
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

    public findUserReservations(data: any) {

        return new Promise((resolve, reject) => {

            this.Model
                .find({ "username": data.username },
                    (err, documents) => {
                        if (err) {

                            const errResponse: ReserveCrudDTO = {
                                opStatus: "error",
                                hasError: true,
                                error: err,
                                data: undefined
                            };
                            reject(errResponse);
                        } else {
                            const successResponse: ReserveCrudDTO = {
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

    public update(data: any) {
        this.UpdateResrvationPayload = new UpdateReservationPayload(data.flightNumber, data.username);
        return new Promise((resolve, reject) => {

            this.Model.findOneAndUpdate(data.query, {
                    $set: data.update

                }, { runValidators: true, new: true }, (err, document) => {
                    if (err) {
                        const errResponse: ReserveCrudDTO = {
                            opStatus: "error",
                            hasError: true,
                            error: err,
                            data: undefined
                        };
                        reject(errResponse);
                    } else {
                        const successResponse: ReserveCrudDTO = {
                            opStatus: "success",
                            hasError: false,
                            error: undefined,
                            data: document
                        };
                        resolve(successResponse);
                    }
                });
        });

    }
    public removeReservationBYCustomer(data: any) {

        return new Promise((resolve, reject) => {
            this.Model
                .find({ "username": data.username })
                .remove((err) => {

                    if (err) {
                        const errResponse: ReserveCrudDTO = {
                            opStatus: "error",
                            hasError: true,
                            error: err,
                            data: undefined
                        };
                        reject(errResponse);
                    } else {
                        const successResponse: ReserveCrudDTO = {
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

    public findCustomersInFlight(data: any) {
        const query = this.Model.find()
            .where("flightNumber").equals(data.flightNumber);

        query.select("username -_id");
        return new Promise((resolve, reject) => {

            query.exec((err, documents) => {
                if (err) {
                    const errResponse: ReserveCrudDTO = {
                        opStatus: "error",
                        hasError: true,
                        error: err,
                        data: undefined
                    };
                    reject(errResponse);
                } else {
                    const successResponse: ReserveCrudDTO = {
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