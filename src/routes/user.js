const express = require('express')
const { auth_request } = require('../middlewares/authorize')
const { ConnectionReqModel } = require('../models/connectionRequest')

const userRouter = express.Router()


userRouter.get('/v1/user/connections/received',auth_request,async(req,res)=>{

    const user = req.user

    try{
        const requests = await ConnectionReqModel.find({toUserId:user,status:"interested"}).populate(
            "fromUserId","firstName lastName"
        )

        if(requests.length>0){
            res.send({
                requests
            })
                
        }else{
            throw new Error("No connection requests found")
        }
    }
    catch(err){
        res.send({
            message: err.message
        })
    }


})

userRouter.get('/v1/user/connections',auth_request,async(req,res)=>{
    const user = req.user

    try{
        const requests = await ConnectionReqModel.find({
            $or:[
                {toUserId:user,status:"accepted"},
                {fromUserId:user,status:"accepted"}
            ]
        } 
        ).populate(
            "fromUserId","firstName lastName"
        ).populate("toUserId","firstName lastName")


        const data = requests.map((request,index)=>{
            if(request.fromUserId._id.equals(user)){
                return request.toUserId
            }else{
                console.log('No')
                console.log(request.fromUserId._id)
                return request.fromUserId
            }
        })
        
        console.log(data)

        if(requests.length>0){
            res.send({
                data
            })
                
        }else{
            throw new Error("No connection requests found")
        }
    }
    catch(err){
        res.send({
            message: err.message
        })
    }
})

module.exports = {
    userRouter
}