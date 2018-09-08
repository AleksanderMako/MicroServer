import * as mongoose from "mongoose";
import UserCrud from "./user.service.ts/userCrud";
import Payload from "./payload";

const initCrudService = (connection: any) => {

    const payload = Payload.getPayload("create", { firstname: "hi", lastName: "there", age: 18 });
    const userService = new UserCrud(payload, connection);
    userService.init();
};

const connect = async () => {
    try {
        const db = await mongoose.connect("mongodb://mongoDB:27017/user", );
        initCrudService(db);
        console.log("Connected");


    } catch (err) {

        console.log(err);
    }
};

connect();



