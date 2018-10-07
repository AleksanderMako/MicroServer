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
        firstname: {

            type: String,
            required: true
        },
        lastname: {
            type: Number,
            required: true,
            min: 1,
            max: 200,
            validate: {
                validator: function (v: any) {
                    return v % 10 !== 0;
                },
                message: `This is not a valid capacity `
            }
        },
        seatNumber: {
            type: String,
            required: true
        }

    });
    reservationSchema.index({ flightNumber: 1 }, { unique: true });
    return reservationSchema;
};
