const mongoose = require('mongoose')
const { messageSchema } = require('./chat')

const Group = new mongoose.Schema({
    name: {
        type:String,
        required :true
    },
    participants : [
        { type: mongoose.Schema.Types.ObjectId , required: true,ref:'User'}
],
    text:[messageSchema]
})

const groupModel = mongoose.model('Group',Group)

module.exports = {
    groupModel
}