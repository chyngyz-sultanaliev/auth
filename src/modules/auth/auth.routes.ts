import { Router } from "express";
import authControllers from "./auth.controllers";

const authRoutes = Router();

authRoutes.post("/register", authControllers.register);
authRoutes.post("/login", authControllers.login);


export default authRoutes;
