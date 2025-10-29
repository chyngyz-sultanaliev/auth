import { Router } from "express";
import cors from "cors";
import authRoutes from "../modules/auth/auth.routes";
const globalRoutes = Router();

const corsConfig = {
  origin: ["http://localhost:3000"],
};

globalRoutes.use("/auth",cors(corsConfig), authRoutes);
export default globalRoutes;
