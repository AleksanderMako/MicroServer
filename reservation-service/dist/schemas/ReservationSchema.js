"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
exports.makeReservationSchema = () => {
    const schema = mongoose.Schema;
    const reservationSchema = new schema({
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
        firstname: {
            type: String,
            required: true
        },
        lastname: {
            type: String,
            required: true,
        },
        seatNumber: {
            type: String,
            required: false
        }
    });
    reservationSchema.index({ flightNumber: 1 }, { unique: true });
    return reservationSchema;
};
//# sourceMappingURL=ReservationSchema.js.map