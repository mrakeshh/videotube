import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

// app.use(cors()) //This configuration is enough but we can configure it ourselves as well
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

//router import
import userRouter from "./routes/user.routes.js";

//route declaration
app.use("/api/v1/users", userRouter)
// the website domain will look like https://localhost:8000/api/v1/users/register

export { app };
