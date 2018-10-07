"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
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
            max: 200,
            validate: {
                validator: function (v) {
                    return v % 10 !== 0;
                },
                message: `This is not a valid capacity `
            }
        }
    });
    return flightSchema;
};
//# sourceMappingURL=flightSchema.js.map