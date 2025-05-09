import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:5000",
    credentials: true,
  })
);
app.use(express.json({ limit: "16mb" }));
app.use(express.urlencoded({ limit: "16mb", extended: true }));
app.use(express.static("public"));

//routes import
import usersRouter from "./routes/users.routes.js";
//routes declaration
app.use("/api/v1/users", usersRouter);
//https//:localhost:5000/api/v1/users/register
//localhost:5000/api/v1/users/login
export { app };
