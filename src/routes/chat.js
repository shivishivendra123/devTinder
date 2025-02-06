const express = require('express')
const { auth_request } = require('../middlewares/authorize')
const { messageModel  } = require('../models/messages')

messageModel
const messageRouter = express.Router()

messageRouter.post('/v1/send/message/:touser',auth_request,async(req,res)=>{
    const user = req.user
    const touser = req.params.touser
    const message_text = req.body.message_text

    console.log(message_text)

    const message_obj = {
        fromId: user, 
        toId:touser,
        message_text:message_text
    }

    try{
        const new_message = new messageModel(message_obj)
        const message_saved = await new_message.save()
        console.log(message_saved)
        res.status(200).json({
            message_saved
        })
    }
    catch(err){
        res.status(400).json({
            message:err.message
        })
    }

})

messageRouter.get("/v1/getallmessage/:other",auth_request,async(req,res)=>{
    const user = req.user
    const other = req.params.other

    const all_messages = await messageModel.find({
        $or:[
            { fromId:user, toId:other},
            { fromId:other, toId:user }
        ]
    })

    console.log(all_messages)

    all_messages.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

    res.status(200).json({
        all_messages
    })
})


module.exports = {
    messageRouter
}