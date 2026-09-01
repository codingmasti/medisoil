import mongoose from "mongoose";

export const connectDB = async ()=>{
    await mongoose.connect("mongodb+srv://adityamaurya1138_db_user:A13hpjYbfNmoAtq3@cluster0.m6gc93c.mongodb.net/Medisoil")
    .then(()=>{
      console.log("DB CONNECTED");
    })
}