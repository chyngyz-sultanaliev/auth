import { Router } from "express";
import authControllers from "./auth.controllers";
import { authMiddleware } from "../../middleware/auth.middleware";

const authRoutes = Router();


authRoutes.post("/register", authControllers.register);
authRoutes.post("/login", authControllers.login);
authRoutes.get("/profile", authMiddleware, authControllers.profile);
authRoutes.post("/logout", authControllers.logout);
authRoutes.put("/profile", authMiddleware, authControllers.update);

export default authRoutes;
