import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const connectDB = async ()=>{ //DataBase is in another continent
    try {
       const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
       console.log(`MongoDB connected!! DB HOST :: ${connectionInstance.connection.host}`);
    //    console.log(`MongoDB connected!! DB HOST :: ${connectionInstance}`);
       
    } catch (error) {
        console.log("MongoDB conncetion FAILED :: ", error)
        process.exit(1)
    }
}

export default connectDB







