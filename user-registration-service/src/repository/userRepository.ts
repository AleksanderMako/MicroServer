import * as userSchema from "../schemas/userSchema";
import * as util from "util";
import * as mongoose from "mongoose";
import Irepository from "./Irepository";
import { rejects } from "assert";

export default class UserRepository implements Irepository {

    private mongooseConection: any;
    private Model: mongoose.Model<any>;
    private readBYusernameParseIfNeeded: any;

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

            this.Model.findOne({ "username": `${data.username}` }, (err, user) => {

                if (err) {
                    reject(err);
                } else {
                    resolve(user);
                }
            });
        });

    }

    public update(data: any) {
        //  let user: any;


        return new Promise((resolve, reject) => {

            this.Model.findOneAndUpdate(
                { "username": data.username },
                {
                    $set: {
                        password: data.password,
                        firstname: data.firstname,
                        lastName: data.lastName,
                        age: data.age
                    },
                }, { runValidators: true, new: true }, (err, document) => {

                    if (err) {
                        reject(err);
                    } else {
                        console.log(document);
                        resolve(document);
                    }
                });
        });




    }

    public delete(data: any) {

        return new Promise((resolve, reject) => {

            this.Model.findOneAndRemove(
                { "username": data.username },
                (err, document) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(document);
                    }
                }
            );
        });

    }

    public readByUsernames(data: any) {

        this.readBYusernameParseIfNeeded = data;
        console.log( this.readBYusernameParseIfNeeded);
        const query = this.Model
            .find()
            .where("username")
            .in(this.readBYusernameParseIfNeeded.map((object: any) => {
                return object.username;
            }));
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