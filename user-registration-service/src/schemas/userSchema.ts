import * as mongoose from "mongoose";
export const makeUserSchema = () => {
    const schema = mongoose.Schema;
    const userSchema = new schema({

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
            validate: {
                validator: function (v: any) {
                    return v % 10 !== 0;
                },
                message: `This is not a valid age `
            }
        }

    });
    return userSchema;
};
