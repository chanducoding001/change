
const mongoose = require("mongoose");

const PersonalWorkSchema = new mongoose.Schema({
    
    title:{
        type:String,
        required:[true,"Personal Work title is required!"]
    },
    content:{
        type:String,
        required:[true,"Personal Work content is required!"]
    }
},
{
    timestamps: true,
}
);

module.exports = mongoose.model('PersonalWork',PersonalWorkSchema);
