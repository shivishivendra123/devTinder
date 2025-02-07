const express = require('express')
const { auth_request } = require('../middlewares/authorize')
const { ConnectionReqModel } = require('../models/connectionRequest')
const { userModel } = require('../models/user')

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
                
                return request.fromUserId
            }
        })
        
    

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
            message: []
        })
    }
})

userRouter.get('/v1/users/feed/',auth_request,async(req,res)=>{
    const user = req.user

    const skip  = parseInt(req.query.page) || 1
    let limit  = parseInt(req.query.limit) || 10
    limit = limit>20?20:limit

  

    try{
        const hiddenUsersFromFeed = await ConnectionReqModel.find({
            $or:[
                {toUserId:user},
                {fromUserId:user}
            ]
        }).select("fromUserId toUserId")

        const hidenUsers = new Set()

        hiddenUsersFromFeed.forEach(huser => {
            console.log(huser.toUserId._id.toString())
            hidenUsers.add(huser.toUserId._id.toString())
            hidenUsers.add(huser.fromUserId._id.toString())
        });

        const arr_users = [...hidenUsers]

        const feed_users = await userModel.find({
            _id:{$nin : Array.from(arr_users)}
        }).select("firstName lastName age gender about skills").skip((skip-1)*10).limit(limit)

        console.log(feed_users)

        res.send({
            feed_users
        })

    }
    catch(err){
        res.status(400).send({
            message:err.message
        })
    }
    
})

module.exports = {
    userRouter
}