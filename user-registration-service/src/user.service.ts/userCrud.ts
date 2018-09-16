import Payload from "../payload";
import * as userSchema from "../schemas/userSchema";
import * as util from "util";
import * as mongoose from "mongoose";

export default class UserCrud {


    private payload: Payload;
    private functionName: string;
    private args: any;
    private mongooseConection: any;
    private userModel: any;

    constructor(payload: any, mongooseConection: any, userSchema: mongoose.Schema) {
        this.payload = Payload.getPayload(payload.functionName, payload.args);
        this.mongooseConection = mongooseConection;
        const UserSchema = userSchema;
        this.userModel = this.mongooseConection.model("user", UserSchema);


    }
    public init() {

       // console.log(this.payload);
        this.functionName = this.payload.getFucnName();
        switch (this.functionName) {

            case "create":
                console.log("INFO: Create Method activated ");
              //  console.log(this.payload.getArguments());
               // console.log(this.payload.getFucnName());

                this.create(this.payload.getArguments());

                break;
            case "read":
                console.log("INFO: read Method activated ");
                break;
            case "update":
                console.log("INFO: update Method activated ");
                break;
            case "delete":
                console.log("INFO: delete Method activated ");
                break;
        }

    }

    public create(args: any) {

        const user = new this.userModel({
            firstname: args.firstname,
            lastName: args.lastName,
            age: args.age
        });

        user.save((err: Error) => {

            if (err) {
                console.log("ERROR:" + err);

            } else {
                console.log("INFO:Success");
            }
        });

    }

    // read() {}

    // update()  {}

    // delete() {}
}