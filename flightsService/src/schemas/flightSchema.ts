import * as mongoose from "mongoose";
import { makeSeatSchema } from "./seatSchema";
const seat = makeSeatSchema();
export const makeFlightSchema = () => {
    const schema = mongoose.Schema;
    const flightSchema = new schema({
        flightNumber: {
            type: String,
            required: [true, "flightNumber is re`quired "],
            validate: {
                validator: function (v: any) {
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
                validator: function (v: any) {
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
        Date: {
            type: Date,
            required: true,
        },
        seats: [seat]

    });
    flightSchema.index({ flightNumber: 1 }, { unique: true });
    return flightSchema;
};
