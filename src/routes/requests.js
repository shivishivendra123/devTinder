const express = require('express')
const { userModel } = require('../models/user')
const { ConnectionReqModel }  = require('../models/connectionRequest')
const requestsRouter = express.Router()
const cookieParser = require('cookie-parser')
const { auth_request } = require('../middlewares/authorize')

requestsRouter.use(cookieParser())



requestsRouter.post('/v1/request/send/:status/:requestId',auth_request,async(req,res)=>{
    const {requestId,status} = req.params
    const userId = req.user
    const connection_obj = {
        fromUserId: userId,
        toUserId:requestId,
        status:status
    }

    const connection_obj_ins = new ConnectionReqModel(connection_obj)

    try{
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


