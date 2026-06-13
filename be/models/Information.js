
const mongoose = require("mongoose");

const informationSchema = new mongoose.Schema({
    title:{
        type:String,
    },
    content:{
        type:String,
        required:[true,"Content is required!"]
    }
},
{
    timestamps: true,
}
);

module.exports = mongoose.model('Information',informationSchema);








