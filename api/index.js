import express from "express"
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRoutes from  "./routes/user.route.js";
import authRoutes from  "./routes/auth.route.js";
import cors  from "cors";


dotenv.config();



mongoose.connect(process.env.MONGO).then(()=>{
    console.log("Connected to MongoDB");
    }).catch(err => {
        console.log(err.message);
        });

const app = express()
app.use(express.json());

app.listen(3000,function(){
    console.log("server listening on port 3000");
    
})
app.use(cors());
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(statusCode).json({
        success: false,
        message,
        statusCode,
    });
});


app.use("/api/user",userRoutes);
app.use("/api/auth",authRoutes);