import "dotenv/config";
import express from "express";
import globalRoutes from "./routes";

const buildServer = () => {
  const server = express();

  server.use(express.json());

  server.get("/", (req, res) => {
    res.status(200).json({
      message: "Hello Work",
    });
  });
   server.use("/api/v1", globalRoutes)
  return server;
};
export default buildServer;
