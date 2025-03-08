const express = require('express')
const { groupModel, memberSchema } = require('../models/group')
const { auth_request } = require('../middlewares/authorize')
const groupChatRouter = express.Router()

groupChatRouter.post("/v1/group/createGroup", auth_request, async (req, res) => {
    const created_by = req.body.created_by
    const groupName = req.body.groupName
    const participants = req.body.participants

    console.log(participants)

    try {

        member_arr = participants.map((part,idx)=>{
            if(part==created_by){
                return (
                    {
                        userId:part,
                        role:"admin"
                    }
                )
            }
            else{
                return (
                    {
                        userId:part,
                        role:"member"
                    }
                )
            }
        })
       
        console.log(member_arr)

        const groupCreate = new groupModel({
            name: groupName,
            participants: member_arr,
            text: [],
            created_by: created_by,
            admins:[created_by]
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
            "participants.userId":{$in : user}
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

groupChatRouter.get('/v1/getGroupInfo/:roomId', async(req,res)=>{
    const gid = req.params.roomId
    
    try{
        const groupInfo = await groupModel.findById(gid).populate("created_by","firstName").populate("participants.userId","firstName")
        res.status(200).json({
            query:groupInfo
        })
    }catch(err){
        res.status(200).json({
            message:err.message
        })
    }

   

    
})


groupChatRouter.post('/v1/leaveGroup/:groupId',auth_request,async(req,res)=>{
    const user = req.user
    const groupId = req.params.groupId

    console.log(groupId)

    try{
        const group = await groupModel.findById(groupId)
        
        let members = group.participants.filter(member=>member.userId!=user)

        group.participants = members

        await group.save()
        res.status(200).json({
            response: group
        })
    }catch(err){
        res.status(200).json({
            response: []
        })
    }    
})

groupChatRouter.post('/v1/kickOutUser',auth_request, async(req,res)=>{
    const user = req.user
    const { member_id, groupId } = req.body

    const group = await groupModel.findById(groupId)

    if(group.admins.includes(user)){
       members = group.participants.filter(member=>member.userId!=member_id)
       group.participants = members
       console.log("Hii")
       console.log(members)
       await group.save()
    }

    // console.log(group)

    res.status(200).json({
        message:"Kicked the user"
    })

})

module.exports = {
    groupChatRouter
}