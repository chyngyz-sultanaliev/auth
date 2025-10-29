"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const generateToken = (userId, UserEmail) => {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        throw new Error("JWT_SECRET не задан в переменных окружения");
    }
    return jsonwebtoken_1.default.sign({ id: userId, email: UserEmail }, secret, {
        expiresIn: "7d",
    });
};
exports.default = {
    generateToken,
};
//# sourceMappingURL=token.js.map