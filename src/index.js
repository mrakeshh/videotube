import mongoose from "mongoose";

//*TIP: Always use try-catch while connecting database and take care of async await

// //one approach to connect database
// function connectDB(){}
// connectDB()

//another approach and the semicolon is for cleaning
;(async ()=>{
    try {

    } catch (error) {
        console.log("DB connection error :: ", error);
        
    }
})()


