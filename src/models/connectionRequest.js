const mongoose = require('mongoose')

const connectionSchema = new mongoose.Schema({
    fromUserId : {
        type: mongoose.Schema.Types.ObjectId,
        required : true,
        ref: 'User'
    },
    toUserId:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
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

connectionSchema.pre('save',function(){
    const connection_schema = this

    if(connection_schema.fromUserId.equals(connection_schema.toUserId)){
        throw new Error('Cant send to itself')
    }
})

connectionSchema.index({ fromUserId: 1, toUserId :1})
const ConnectionReqModel = new mongoose.model('ConnectionRequest',connectionSchema)

module.exports = {
    ConnectionReqModel
}