const express = require('express')
const { groupModel } = require('../models/group')
const { auth_request } = require('../middlewares/authorize')
const groupChatRouter = express.Router()

groupChatRouter.post("/v1/group/createGroup", auth_request, async (req, res) => {
    const groupName = req.body.groupName
    const participants = req.body.participants

    console.log(groupName)

    try {
        const groupCreate = new groupModel({
            name: groupName,
            participants: participants,
            text: []
        })

        await groupCreate.save()
        res.status(200).json({
            message: "Group Created Successfully"
        })
    }


    catch (err) {
        res.status(400).json({
            message: err.message
        })
    }

})

groupChatRouter.get('/v1/getMyGroups', auth_request, async (req, res) => {
    const user = req.user

    try {
        const query = await groupModel.find({
            participants: { $in: [user] }
        })

        console.log(query)
        res.status(200).send({
            query
        })
    }
    catch (err) {
        res.status(500).send({
            query: []
        }

        )
    }


})

groupChatRouter.get('/v1/getMyGroupChat/:roomId', auth_request, async (req, res) => {
    const user = req.user
    const room_id = req.params.roomId

    try {
        const user_chat_obj = await groupModel.findById(room_id).populate("text.senderId","firstName")

        res.send({
            chats: user_chat_obj.text
        })
    }
    catch (err) {
        res.send(500).json({
            chats: []
        })
    }
})

module.exports = {
    groupChatRouter
}