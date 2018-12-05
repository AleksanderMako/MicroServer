"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
exports.makeSeatSchema = () => {
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
//# sourceMappingURL=seatSchema.js.map