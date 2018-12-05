import * as mongoose from "mongoose";
export const makeUserSchema = () => {
    const schema = mongoose.Schema;
    const userSchema = new schema({
        username: {
            type: String,
            required: [true, "username is re`quired "],
            validate: {
                validator: function (v: any) {
                    if (v.length <= 4) {
                        return false;
                    }
                },
                message: "username is too short must be longer than 4 characters ",
            }

        },
        password: {
            type: String,
            required: [true, "password is required "],
            validate: {
                validator: function (v: any) {
                    if (v.length <= 4) {
                        return false;
                    }
                },
                message: "password is too short must be longer than 4 characters ",
            }
        },

        firstname: {
            type: String,
            required: true
        },
        lastName: {

            type: String,
            required: true
        },
        age: {
            type: Number,
            required: true,
            min: 1,
            max: 99,

        },
        typeOfUser: {
            type: String
        }

    });
    userSchema.index({ username: 1 }, { unique: true });

    return userSchema;
};
