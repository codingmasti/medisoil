import express from "express";
import cors from "cors";
import "dotenv/config";
const app = express();
const port = 4000;





//Middleware



//DB



//Routes

//Home route
app.get("/",(req, res)=>{
    res.send("Server is started")
})

///clurk publick and private key durationj 44 min
app.listen(port,()=>{
    console.log(`Server listing on port ${port}`)
})