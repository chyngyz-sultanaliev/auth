"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controllers_1 = __importDefault(require("./auth.controllers"));
const authRoutes = (0, express_1.Router)();
authRoutes.post("/register", auth_controllers_1.default.register);
authRoutes.post("/login", auth_controllers_1.default.login);
exports.default = authRoutes;
//# sourceMappingURL=auth.routes.js.map