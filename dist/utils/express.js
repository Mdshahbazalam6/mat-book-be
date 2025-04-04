"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.responseFormatter = void 0;
const responseFormatter = ({ success, data, message, error_code }) => {
    const responseObject = { success, message, data };
    if (!success) {
        responseObject.error_code = error_code !== null && error_code !== void 0 ? error_code : 500;
    }
    if (!success && !message) {
        responseObject.message = 'Unknown error';
    }
    return responseObject;
};
exports.responseFormatter = responseFormatter;
