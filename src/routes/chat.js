const express = require('express')
const { auth_request } = require('../middlewares/authorize')
const { messageModel  } = require('../models/messages')
const { ChatModel } = require('../models/chat')

const messageRouter = express.Router()



messageRouter.get("/v1/requestAllChats/:user2",auth_request,async(req,res)=>{
    const user = req.user
    const user2 = req.params.user2


    try{
        let chat = await ChatModel.findOne({
            participants : {
                $all : [user, user2]
            }     
        }).populate("text.senderId","firstName")

        console.log(chat)

        res.status(200).json({
            chat:chat.text
        })
    }
    catch(err){
        res.status(500).json({
            chat:[],
            message:err.message
        })
    }
})

module.exports = {
    messageRouter
}
