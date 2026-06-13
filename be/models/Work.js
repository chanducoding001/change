
const mongoose = require("mongoose");

const workSchema = new mongoose.Schema({
    
    title:{
        type:String,
        required:[true,"Work title is required!"]
    },
    content:{
        type:String,
        required:[true,"Work content is required!"]
    }
},
{
    timestamps: true,
}
);

module.exports = mongoose.model('Work',workSchema);
