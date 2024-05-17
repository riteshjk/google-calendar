import express from 'express';
import connectDB from './config/db.js';
import tokenRouter from "./routes/tokenRoutes.js"
import eventRouter from "./routes/event.routes.js"
import cors from "cors"


const app = express();
app.use(express.json());


app.use(cors())

app.use("/api",tokenRouter)
app.use("/api",eventRouter)


app.listen(3000, async()=>{
    try{
        await connectDB()
        console.log("connected to database successfully");
        console.log("server is running on port 3000");
    }
    catch(err){
        console.log(err,"failed to connect to database");
    }
   
})

