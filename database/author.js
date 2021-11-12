const mongoose = require('mongoose');

const AuthorSchema = mongoose.Schema({
    id:{
        type:Number,
        required:true,
        minLength:1,
    },
    name:{
        type:String,
        required:true,
        minLength:3,
    },
    books:[String],
});

const AuthorModel = mongoose.model("authors",AuthorSchema);

module.exports = AuthorModel;