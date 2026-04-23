import "dotenv/config";
import path from "path";
import express, { Request, Response } from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import http from "http";
import passport from "passport";
import { Env } from "./config/env.config";
import { asyncHandler } from "./middlewares/asyncHandler.middleware";
import { HTTPSTATUS } from "./config/http.config";
import { errorHandler } from "./middlewares/errorHandler.middleware";
import connectDatabase from "./config/database.config";
import { initializeSocket } from "./lib/socket";
import routes from "./routes";

import "./config/passport.config";

const app = express();
const server = http.createServer(app);

app.use(
  cors({
    origin: (origin, callback) => {
      const allowedOrigins = [Env.FRONTEND_ORIGIN, "http://localhost:5173", "http://127.0.0.1:5173"];
      console.log(`CORS Request - Origin: ${origin}, Allowed: ${allowedOrigins.join(", ")}`);
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.log(`CORS REJECTED: ${origin} not in ${allowedOrigins.join(", ")}`);
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
  })
);

//socket
initializeSocket(server);

app.use(express.json({ limit: "10mb" }));
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

app.use(passport.initialize());

app.get(
  "/health",
  asyncHandler(async (req: Request, res: Response) => {
    res.status(HTTPSTATUS.OK).json({
      message: "Server is healthy",
      status: "OK",
    });
  })
);

app.use("/api", routes);

if (Env.NODE_ENV === "production") {
  const clientPath = path.resolve(__dirname, "../../client/dist");

  //Serve static files
  app.use(express.static(clientPath));

  app.get(/^(?!\/api).*/, (req: Request, res: Response) => {
    res.sendFile(path.join(clientPath, "index.html"));
  });
}

app.use(errorHandler);

import { getAIUser } from "./services/ai.service";

server.listen(Env.PORT, async () => {
  await connectDatabase();
  await getAIUser();
  console.log(`Server running on port ${Env.PORT} in ${Env.NODE_ENV} mode`);
});
