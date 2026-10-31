import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

let connectionPromise = null;

const connectDB = async () => {
  if (mongoose.connection.readyState === 1) return;

  if (!connectionPromise) {
    connectionPromise = mongoose
      .connect(process.env.MONGODB_URI, { dbName: DB_NAME })
      .catch((error) => {
        connectionPromise = null; // allow a retry on the next request
        console.log("MongoDB connection FAILED :: ", error);
        throw error;
      });
  }

  await connectionPromise;
  console.log("MongoDB connected!!");
};

export default connectDB;