"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const seatSchema_1 = require("./seatSchema");
const seat = seatSchema_1.makeSeatSchema();
exports.makeFlightSchema = () => {
    const schema = mongoose.Schema;
    const flightSchema = new schema({
        flightNumber: {
            type: String,
            required: [true, "flightNumber is re`quired "],
            validate: {
                validator: function (v) {
                    if (v.length <= 4) {
                        return false;
                    }
                },
                message: "flightNumber is too short must be longer than 4 characters ",
            }
        },
        departure: {
            type: String,
            required: [true, "departure is required "],
            validate: {
                validator: function (v) {
                    if (v.length <= 4) {
                        return false;
                    }
                },
                message: "departure is too short must be longer than 4 characters ",
            }
        },
        destination: {
            type: String,
            required: true
        },
        airplaneType: {
            type: String,
            required: true
        },
        capacity: {
            type: Number,
            required: true,
            min: 1,
            max: 600,
        },
        seats: [seat]
    });
    flightSchema.index({ flightNumber: 1 }, { unique: true });
    return flightSchema;
};
//# sourceMappingURL=flightSchema.js.map