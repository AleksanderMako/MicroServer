import Payload from "../payload";
import * as userSchema from "../schemas/userSchema";
import * as util from "util";
import * as mongoose from "mongoose";
import Irepository from "../repository/Irepository";

export default class UserCrud {


    private payload: Payload;
    private functionName: string;
    private args: any;
    private mongooseConection: any;
    private userModel: any;
    private userRepo: Irepository;

    constructor(payload: any, userRepositoryObject: Irepository) {
        this.payload = Payload.getPayload(payload.functionName, payload.args);

        this.userRepo = userRepositoryObject;


    }
    public init() {

        // console.log(this.payload);
        this.functionName = this.payload.getFucnName();
        switch (this.functionName) {

            case "create":
                console.log("INFO: Create Method activated ");
                console.log("\n ");
                console.log("\n ");


                //  console.log(this.payload.getArguments());
                // console.log(this.payload.getFucnName());

                this.create(this.payload.getArguments());

                break;
            case "read":
                console.log("INFO: read Method activated ");
                console.log("\n ");
                console.log("\n ");
                 this.read();

                break;
            case "update":
                console.log("INFO: update Method activated ");
                break;
            case "delete":
                console.log("INFO: delete Method activated ");
                break;
            default: console.log("No method invoked here "); break;
        }

    }

    public create(args: any) {


        this.userRepo.create(args);

    }

    public async  read() {
        const users = await this.userRepo.readAll();
        console.log(users);
    }

    // update()  {}

    // delete() {}
}