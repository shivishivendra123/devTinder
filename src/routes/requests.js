const express = require('express')
const { userModel } = require('../models/user')
const { ConnectionReqModel }  = require('../models/connectionRequest')
const requestsRouter = express.Router()
const cookieParser = require('cookie-parser')
const { auth_request } = require('../middlewares/authorize')
const { error } = require('winston')

requestsRouter.use(cookieParser())



requestsRouter.post('/v1/request/send/:status/:requestId',auth_request,async(req,res)=>{
    const {requestId,status} = req.params
    const userId = req.user
    
    

    try{

        if(requestId==userId){
            throw new Error("Cant send request to itself")
        }
        const connect_history = await ConnectionReqModel.find({
            $or: [
                { fromUserId:userId,toUserId : requestId},
                { fromUserId:requestId,toUserId : userId}
            ]
        }) 
       
        if(connect_history.length >0){
        
            res.send({
                message: "Invalid or duplicate request"
            })
            return
        }

        // if(connect_history.length >0 && connect_history[0].status != status){
        //     let Updated_connection_obj = {
        //         _id: connect_history._id,
        //         fromUserId: userId,
        //         toUserId:requestId,
        //         status:status
        //     }

        //     Updated_connection_obj = new ConnectionReqModel(Updated_connection_obj)
        //     await Updated_connection_obj.save()
        //     res.send({
        //         mesaage: "New Request sent"
        //     })
        //     return
        // }

        if(!['interested','ignore'].includes(status)){
            throw new Error("Invalid status type")
        }

        const connection_obj = {
            fromUserId: userId,
            toUserId:requestId,
            status:status
        }
    
        
    
        const connection_obj_ins = new ConnectionReqModel(connection_obj)
        await connection_obj_ins.save()

        console.log(connection_obj_ins)
        res.send({
            message:`${status} request sent`
        })
    }
    catch(err){
        res.send({
            mesaage:err.message
        })
    }
})



module.exports = {
    requestsRouter
}


