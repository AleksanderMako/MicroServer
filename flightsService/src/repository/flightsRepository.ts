import * as userSchema from "../schemas/flightSchema";
import * as mongoose from "mongoose";
import Irepository from "./Irepository";

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

    public create(data: any) {
        const flight = new this.Model({
            flightNumber: data.flightNumber,
            departure: data.departure,
            destination: data.destination,
            airplaneType: data.airplaneType,
            capacity: data.capacity
        });

        // const error: Error = flight.validateSync();
        return new Promise((resolve, reject) => {
            flight.save((err: Error) => {

                if (err) {
                    console.log("ERROR Inside promise:" + err);
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
    public readOne(data: any) {
        return new Promise((resolve, reject) => {

            this.Model.findOne({ "flightNumber": `${data.flightid}` }, (err, user) => {

                if (err) {
                    reject(err);
                } else {
                    resolve(user);
                }
            });
        });

    }

}