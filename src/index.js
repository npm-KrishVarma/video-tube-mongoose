import dotenv from "dotenv";
import connectDB from "./db/index.js";
import app from "./app.js";

const PORT = process.env.PORT || 8001

dotenv.config({ path: './env' })


connectDB()
    .then(()=>{
        app.on("error",(error)=>{
            console.log('Error:', error)
            throw error;
        })
        app.listen(PORT,() => {
            console.log(`Server is Running in PORT: ${PORT}`)
        })
    })
    .catch((error)=>{
        console.log('MongoDB Connection Failed:', error.stack)
    })