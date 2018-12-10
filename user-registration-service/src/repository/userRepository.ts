import * as userSchema from "../schemas/userSchema";
import * as util from "util";
import * as mongoose from "mongoose";
import Irepository from "./Irepository";
import UserCrudDTO from "../userServiceDTOS/userCrudDTO";
import * as bcrypt from "bcrypt";

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

    public seedAdmin(admin: any) {
        const secured = this.securePassword(admin.password)
        const user = new this.Model({
            username: admin.username,
            password: secured.hash,
            firstname: admin.firstname,
            lastName: admin.lastName,
            age: admin.age,
            typeOfUser: admin.typeOfUser,
            salt: secured.salt
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

    public create(data: any) {
        const secured = this.securePassword(data.password);
        const user = new this.Model({
            username: data.username,
            password: secured.hash,
            firstname: data.firstname,
            lastName: data.lastName,
            age: data.age,
            typeOfUser: "simple",
            salt: secured.salt
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

            this.Model.find({ "typeOfUser": "simple" }, (err, users) => {

                if (err) {
                    const responseDto: UserCrudDTO = {
                        opStatus: "error",
                        hasError: true,
                        error: err,
                        data: "failed to read customers"
                    };
                    reject(responseDto);

                } else {
                    const responseDto: UserCrudDTO = {
                        opStatus: "success",
                        hasError: false,
                        error: undefined,
                        data: users
                    };
                    resolve(responseDto);
                }
            });
        });


    }
    public readOne(data: any) {
        return new Promise((resolve, reject) => {

            this.Model.findOne({ "username": `${data.username}` }, (err, user) => {

                if (err) {
                    const responseDto: UserCrudDTO = {
                        opStatus: "error",
                        hasError: true,
                        error: err,
                        data: "failed to read customer"
                    };
                    reject(responseDto);
                } else {
                    const responseDto: UserCrudDTO = {
                        opStatus: "success",
                        hasError: false,
                        error: undefined,
                        data: user
                    };
                    resolve(responseDto);
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
                        firstname: data.firstname,
                        lastName: data.lastName,
                        age: data.age
                    },
                }, { runValidators: true, new: true }, (err, document) => {

                    if (err) {
                        const responseDto: UserCrudDTO = {
                            opStatus: "error",
                            hasError: true,
                            error: err,
                            data: "failed to update customer"
                        };
                        reject(responseDto);
                    } else {
                        const responseDto: UserCrudDTO = {
                            opStatus: "success",
                            hasError: false,
                            error: undefined,
                            data: document
                        };
                        console.log(document);
                        resolve(responseDto);
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
                        const responseDto: UserCrudDTO = {
                            opStatus: "error",
                            hasError: true,
                            error: err,
                            data: "failed to delete customer"
                        };
                        reject(responseDto);
                    } else {
                        const responseDto: UserCrudDTO = {
                            opStatus: "success",
                            hasError: false,
                            error: undefined,
                            data: document
                        };
                        resolve(responseDto);
                    }
                }
            );
        });

    }

    public readByUsernames(data: any) {

        this.readBYusernameParseIfNeeded = data;
        console.log(this.readBYusernameParseIfNeeded);
        const query = this.Model
            .find()
            .where("username")
            .in(this.readBYusernameParseIfNeeded.data.map((object: any) => {
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

    public securePassword(password: any) {
        console.log("password to hash is :");
        console.log(JSON.stringify(password));


        const saltRounds = 2;
        const salt = bcrypt.genSaltSync(saltRounds);
        const hashedPassword = bcrypt.hashSync(password + salt, 2);
        return {
            salt: salt,
            hash: hashedPassword
        };
    }
}