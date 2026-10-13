// require('dotenv').config({path: './env'}) //This approach breaks the consitency of our code

import dotenv from "dotenv";
import connectDB from "./db/index.js";
import { app } from "./app.js";

dotenv.config({
  path: "./.env",
});

connectDB()
  .then(() => {
    app.on("error", (error) => {
      console.log("Error :: ", error);
      throw error;
    });
    app.listen(process.env.PORT || 8000, () => {
      console.log(`Server is runnig at port : ${process.env.PORT}`);
    });
  })
  .catch((error) => {
    console.log("MONGO DB CONNECTION FAILED :: ", error);
  });

// import mongoose from "mongoose";
// import { DB_NAME } from "./constants";
/* //This is approach 1
import express from "express"
const app = express()

//*TIP: Always use try-catch while connecting database and take care of async await

// //one approach to connect database
// function connectDB(){}
// connectDB()

//another approach and the semicolon is for cleaning
;(async ()=>{
    try {
       await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
       app.on("error", (error)=>{
        console.log("Error :: ", error);
        throw error
       })
       app.listen(process.env.PORT, ()=>{
        console.log(`App is listening on ${process.env.PORT}`);
        
       })
    } catch (error) {
        console.log("DB connection error :: ", error);
        throw error
        
    }
})()
*/
//DataBase connection revised
