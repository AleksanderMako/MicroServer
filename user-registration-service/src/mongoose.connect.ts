import * as mongoose from "mongoose";
import { SSL_OP_CRYPTOPRO_TLSEXT_BUG } from "constants";
const connect = async () => {
    try {
        await mongoose.connect("mongodb://mongoDB:27017/user");
        console.log("Connected");
    } catch (err) {

        console.log(err);
    }
};

connect();
