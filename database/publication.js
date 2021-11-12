const mongoose = require('mongoose');
const PublicationSchema = mongoose.Schema({
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

const PublicationModel = mongoose.model("publications",PublicationSchema);

module.exports = PublicationModel;