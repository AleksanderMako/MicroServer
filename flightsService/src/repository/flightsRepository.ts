import * as userSchema from "../schemas/flightSchema";
import * as mongoose from "mongoose";
import Irepository from "./Irepository";
import FlightCrudDTO from "../flightCrudDTOs/flightCrudDTO";

export default class FlightRepository implements Irepository {

    private mongooseConection: any;
    private Model: mongoose.Model<any>;


    constructor(mongooseConection: any, Schema: mongoose.Schema) {
        this.mongooseConection = mongooseConection;
        const flightSchema = Schema;
        this.Model = this.mongooseConection.model("flight", flightSchema);
    }
    public setModel(model: mongoose.Model<any>) {
        this.Model = model;
    }
    // for demo purposes seat management is seeded with sample seats
    public create(data: any) {
        const flight = new this.Model({
            flightNumber: data.flightNumber,
            departure: data.departure,
            destination: data.destination,
            airplaneType: data.airplaneType,
            capacity: data.capacity,
            Date: data.date,
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
            flight.save((err: Error) => {

                if (err) {
                    const flightErrorResponse: FlightCrudDTO = {
                        opStatus: "error",
                        hasError: true,
                        error: err,
                        data: undefined
                    };
                    console.log("ERROR Inside promise:" + err);
                    reject(flightErrorResponse);

                } else {
                    const flightSuccessResponse: FlightCrudDTO = {
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

    public readAll() {

        return new Promise((resolve, reject) => {

            this.Model.find({}, (err, flights) => {

                if (err) {
                    const flightErrorResponse: FlightCrudDTO = {
                        opStatus: "error",
                        hasError: true,
                        error: err,
                        data: undefined
                    };
                    reject(flightErrorResponse);

                } else {
                    const flightSuccessResponse: FlightCrudDTO = {
                        opStatus: "success",
                        hasError: false,
                        error: undefined,
                        data: flights
                    };
                    resolve(flightSuccessResponse);
                }
            });
        });

    }
    public readOne(data: any) {
        return new Promise((resolve, reject) => {

            this.Model.findOne({ "flightNumber": `${data.flightNumber}` }, (err, user) => {

                if (err) {
                    const flightErrorResponse: FlightCrudDTO = {
                        opStatus: "error",
                        hasError: true,
                        error: err,
                        data: undefined
                    };
                    reject(flightErrorResponse);
                } else {
                    const flightSuccessResponse: FlightCrudDTO = {
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

    public update(data: any) {

        return new Promise((resolve, reject) => {

            this.Model.findOneAndUpdate(
                {
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
                        const flightErrorResponse: FlightCrudDTO = {
                            opStatus: "error",
                            hasError: true,
                            error: err,
                            data: undefined
                        };
                        reject(flightErrorResponse);
                    } else {
                        const flightSuccessResponse: FlightCrudDTO = {
                            opStatus: "success",
                            hasError: false,
                            error: undefined,
                            data: document
                        };
                        resolve(flightSuccessResponse);
                    }
                }
            );
        });
    }

    public delete(data: any) {

        return new Promise((resolve, reject) => {

            this.Model.findOneAndRemove(
                { "flightNumber": data.flightNumber },
                (err, document) => {
                    if (err) {
                        const flightErrorResponse: FlightCrudDTO = {
                            opStatus: "error",
                            hasError: true,
                            error: err,
                            data: undefined
                        };
                        reject(flightErrorResponse);
                    } else {
                        const flightSuccessResponse: FlightCrudDTO = {
                            opStatus: "success",
                            hasError: false,
                            error: undefined,
                            data: document
                        };
                        resolve(flightSuccessResponse);
                    }
                }
            );
        });

    }

    public updateSeatStatus(data: any) {

        return new Promise((resolve, reject) => {

            this.Model.findOneAndUpdate({
                "flightNumber": data.flightNumber,
                "seats._id": data._id
            }, {
                    $set: {
                        "seats.$.status": "reserved"
                    }

                }, (err: any, document: any) => {
                    if (err) {
                        const flightErrorResponse: FlightCrudDTO = {
                            opStatus: "error",
                            hasError: true,
                            error: err,
                            data: undefined
                        };
                        reject(flightErrorResponse);
                    } else {
                        const flightSuccessResponse: FlightCrudDTO = {
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

}