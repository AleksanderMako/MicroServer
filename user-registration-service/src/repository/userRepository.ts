import * as userSchema from "../schemas/userSchema";
import * as util from "util";
import * as mongoose from "mongoose";
import Irepository from "./Irepository";

export default class UserRepository implements Irepository {

    private mongooseConection: any;
    private Model: mongoose.Model<any>;


    constructor(mongooseConection: any, Schema: mongoose.Schema) {
        this.mongooseConection = mongooseConection;
        const UserSchema = Schema;
        this.Model = this.mongooseConection.model("user", UserSchema);
    }
    public setModel(model: mongoose.Model<any>) {
        this.Model = model;
    }

    public create(data: any) {
        const user = new this.Model({
            username: data.username,
            password: data.password,
            firstname: data.firstname,
            lastName: data.lastName,
            age: data.age
        });

        // const error: Error = user.validateSync();
        return new Promise((resolve, reject) => {
            user.save((err: Error) => {

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
    public readOne(data: any) {
        return new Promise((resolve, reject) => {

            this.Model.findOne({ "username": `${data.id}` }, (err, user) => {

                if (err) {
                    reject(err);
                } else {
                    resolve(user);
                }
            });
        });

    }

}