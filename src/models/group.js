const mongoose = require('mongoose')

const { messageSchema } = require('./chat')

const memberSchema = new mongoose.Schema({
    userId: { type:mongoose.Schema.Types.ObjectId ,ref:'User',required: true},
    role: {
        type: String,
        enum :{
            values: ['member','admin'],
            message:  `{VALUE} is a invalid type`
        },
        required: true
    },
    joined_at:{
        type: Date , default:Date.now
    }
})

const Group = new mongoose.Schema({
    name: {
        type:String,
        required :true
    },
    participants : [
        memberSchema
    ],
    text:[messageSchema],
    created_by:{
        type: mongoose.Schema.Types.ObjectId , ref:'User',required:true
    },
    admins:[{
        type: mongoose.Schema.Types.ObjectId , ref:'User',required:true
    }]  
},{
    timestamps:true
})

const groupModel = mongoose.model('Group',Group)

module.exports = {
    groupModel,
    memberSchema
}