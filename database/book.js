const mongoose = require('mongoose');
//creating a book schema
const BookSchema = mongoose.Schema({
    ISBN:{
        type:String,
        required:true,
        minLength:8,
        maxLength:10,
    },
    title:{
        type:String,
        required:true,
        minLength:30,
        maxLength:40,
    },
    authors:[Number],
    language:String,
    pubDate:String,    
    numPage:Number,    
    category:[String],
    publications:Number,       
});

//create a book model - document model of mongodb 
const BookModel = mongoose.model("books",BookSchema);

//to use this model in other files
module.exports = BookModel;
