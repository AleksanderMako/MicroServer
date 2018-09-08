import Payload from "../payload";
import * as userSchema from "../schemas/userSchema";
import * as util from "util";

export default class UserCrud {


    private payload: Payload;
    private functionName: string;
    private args: any;
    private mongooseConection: any;
    private userModel: any;

    constructor(payload: Payload, mongooseConection: any) {
        this.payload = payload;
        this.mongooseConection = mongooseConection;
        const UserSchema = userSchema.makeUserSchema();
        this.userModel = this.mongooseConection.model("user", UserSchema);


    }
    public init() {

        this.functionName = this.payload.getFucnName();
        switch (this.functionName) {

            case "create":
                console.log("INFO: Create Method activated ");
                console.log(this.payload.getArguments());
                console.log(this.payload.getFucnName());

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