const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    fulname : {
        type:String,
        required:true
    },
    email : {
        type:String,
        required:true
    },
    phone : {
        type:Number,
        required:true
    },
    city : {
        type:String,
        required:true
    },
    gender : {
        type:String,
        required:true
    },
    age : {
        type:Number,
        required:true
    },
    message : {
        type:String,
        required:true
    },
    date:{
        type:Date,
        default:Date.now
    }
})


const Message = new mongoose.model("Message", userSchema);

module.exports = Message;