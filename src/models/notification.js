const mongoose = require('mongoose')
const { messageSchema } = require('./chat')

const notifySchema = new mongoose.Schema({
    userId:
    {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    message: {
        type: String,
        required: true
    },
    status:{
        type: String,
        enum :{
            values: ['seen','unseen'],
            message:  `{VALUE} is a invalid type`
        },
        required: true
        
    }
})

const notifyModel = mongoose.model('Notification',notifySchema)

module.exports = {
    notifyModel
}