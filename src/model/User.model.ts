import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import { Config } from "../config/env";
import { REGEX } from "../constants/Regex";

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        trim: true,
        validate: (value: string) => {
            if (!REGEX.firstName.test(value)) {
                throw new Error("Name is invalid");
            }
        }
    },
    lastName: {
        type: String,
        required: true,
        trim: true,
        validate: (value: string) => {
            if (!REGEX.lastName.test(value)) {
                throw new Error("Name is invalid");
            }
        }
    },
    email: {
        type: String,
        required: true,
        trim: true,
        validate: (value: string) => {
            if (!REGEX.email.test(value)) {
                throw new Error("Email is invalid");
            }
        }
    },
    password: {
        type: String,
        required: true,
        // validate(value: string) {
        //     if (!REGEX.password.test(value)) {
        //         throw new Error("Enter a Strong Password: " + value);
        //     }
        // },
    },
    pinnedWorkFlow: {
        type: [
            mongoose.Schema.Types.ObjectId
        ],
        default: [],
    }
}, {
    timestamps: true
})

userSchema.methods.getJWT = async function () {
    const user = this;

    if (!Config.JWT_SECRET || !Config.TOKEN_EXPIRY_TIME) {
        throw new Error("JWT_SECRET or TOKEN_EXPIRY_TIME is not defined in the configuration.");
    }

    //@ts-ignore
    return jwt.sign(
        { _id: user._id.toString(), email: user.email, firstName: user.firstName, lastName: user.lastName },
        Config.JWT_SECRET,
        { expiresIn: Config.TOKEN_EXPIRY_TIME ?? '1d' }
    );
};


export const User = mongoose.model('User', userSchema);