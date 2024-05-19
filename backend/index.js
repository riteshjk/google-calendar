import express from 'express';
import connectDB from './config/db.js';
import cookieParser from 'cookie-parser';
import eventRouter from "./routes/event.routes.js"
import userRoute from "./routes/Oauth.routes.js"
import cors from "cors";
import dotenv from "dotenv";
import path from 'path';

dotenv.config();

const app = express();
app.use(express.json());

app.use(cors({origin:"*"}));
app.use(cookieParser());
app.use("/auth",userRoute)
app.use("/auth",eventRouter)

const __dirname = path.resolve();

app.use(express.static(path.join(__dirname, "/frontend/dist")));

app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "frontend", "dist", "index.html"));
})

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