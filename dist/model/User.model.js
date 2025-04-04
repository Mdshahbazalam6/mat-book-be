"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_1 = require("../config/env");
const Regex_1 = require("../constants/Regex");
const userSchema = new mongoose_1.default.Schema({
    firstName: {
        type: String,
        required: true,
        trim: true,
        validate: (value) => {
            if (!Regex_1.REGEX.firstName.test(value)) {
                throw new Error("Name is invalid");
            }
        }
    },
    lastName: {
        type: String,
        required: true,
        trim: true,
        validate: (value) => {
            if (!Regex_1.REGEX.lastName.test(value)) {
                throw new Error("Name is invalid");
            }
        }
    },
    email: {
        type: String,
        required: true,
        trim: true,
        validate: (value) => {
            if (!Regex_1.REGEX.email.test(value)) {
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
            mongoose_1.default.Schema.Types.ObjectId
        ],
        default: [],
    }
}, {
    timestamps: true
});
userSchema.methods.getJWT = async function () {
    var _a;
    const user = this;
    if (!env_1.Config.JWT_SECRET || !env_1.Config.TOKEN_EXPIRY_TIME) {
        throw new Error("JWT_SECRET or TOKEN_EXPIRY_TIME is not defined in the configuration.");
    }
    //@ts-ignore
    return jsonwebtoken_1.default.sign({ _id: user._id.toString(), email: user.email, firstName: user.firstName, lastName: user.lastName }, env_1.Config.JWT_SECRET, { expiresIn: (_a = env_1.Config.TOKEN_EXPIRY_TIME) !== null && _a !== void 0 ? _a : '1d' });
};
exports.User = mongoose_1.default.model('User', userSchema);
