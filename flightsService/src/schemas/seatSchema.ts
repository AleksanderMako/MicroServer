import * as mongoose from "mongoose";

export const makeSeatSchema = () => {
    const schema = mongoose.Schema;
    const seatSchema = new schema({
        row: {
            type: Number,

        },
        column: {

            type: String,
            required: true
        },
        SeatIDS: {
            type: String,

        },
        status: {
            type: String
        }

    });
    return seatSchema;
};
