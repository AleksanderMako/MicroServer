import * as mongoose from "mongoose";
export const makeReservationSchema = () => {
    const schema = mongoose.Schema;
    const reservationSchema = new schema({
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

        username: {
            type: String,
            required: [true, "username is required "],
            validate: {
                validator: function (v: any) {
                    if (v.length <= 4) {
                        return false;
                    }
                },
                message: "username is too short must be longer than 4 characters ",
            }

        },
        seatNumber: {
            type: String,
            required: [false, "seatnumber is required"]
        },
        Departure: {
            type: String,
            required: [false, "Departure is required"]
        },
        Destination: {
            type: String,
            required: [false, "Destination is required"]
        },
        Date: {
            type: Date,
            required: [false, "Date is required"]
        },
        firstname: {
            type: String,
            required: [false, "firstname is required"]
        }
        ,
        lastName: {
            type: String,
            required: [false, "lastName is required"]
        }

    });
    reservationSchema.index({ flightNumber: 1, username: 1 }, { unique: true });
    return reservationSchema;
};
