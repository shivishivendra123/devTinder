const mongoose = require('mongoose')

const messageSchema = new mongoose.Schema({
    fromId :{
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    toId :{
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    message_text:{
        type:String,
        required: true
    }
},{
    timestamps:true
})


const messageModel = mongoose.model('Messages',messageSchema) 

module.exports = {
    messageModel
}