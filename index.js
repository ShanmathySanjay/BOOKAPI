require("dotenv").config();
//Framework
const express= require("express");
//mongoose
const mongoose=require("mongoose");

//Microservices Routes
const Books = require("./API/Book");
const Authors = require("./API/Author");
const Publications = require("./API/Publication");
//Initialization
const booky=express();

//Configuration - telling the server to use JSON
booky.use(express.json());

//establish databse connection
mongoose.connect(process.env.MONGO_URL,{
    useNewUrlParser:true,
    useUnifiedTopology:true,
})
.then(()=>console.log('connection established'))
.catch((err)=>console.log(err));

//Initializing Microservices
booky.use("/book",Books);
booky.use("/author",Authors);
booky.use("/publication",Publications);

booky.listen(3000,()=>console.log("Server is running"));



