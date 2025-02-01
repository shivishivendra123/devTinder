const mongoose = require('mongoose')

const connectionSchema = new mongoose.Schema({
    fromUserId : {
        type: mongoose.Schema.Types.ObjectId,
        required : true
    },
    toUserId:{
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    status:{
        type: String,
        enum :{
            values: ['ignore','accepted',"rejected",'interested'],
            message:  `{VALUE} is a invalid type`
        },
        required: true
    }
},{
    timestamps: true
})

const ConnectionReqModel = new mongoose.model('ConnectionRequest',connectionSchema)

module.exports = {
    ConnectionReqModel
}