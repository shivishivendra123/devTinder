const express = require('express')
const { userModel } = require('../models/user')
const profileRouter = express.Router()
const { auth_request } = require('../middlewares/authorize')
const cookieParser = require('cookie-parser')


profileRouter.use(cookieParser())

profileRouter.get('/v1/profile/view',auth_request,async(req,res)=>{
    const user = req.user

    const user_found = await userModel.findById(user)

    res.json({
        user_found
    })

    
})

profileRouter.patch('/v1/profile/edit',auth_request,async(req,res)=>{
    const { userId }  = req.user

    const data  = req.body

    ALLOWED_UPDATES = [
        'userID',
        'photoURL',
        'about',
        'gender',
        'age',
        'skills'
    ]

    const isUpdateAllowed = Object.keys(data).every((k)=>ALLOWED_UPDATES.includes(k))

    if(!isUpdateAllowed){
        res.send({
            message: "Update Not allowed"
        })
    }

    try{
        await userModel.findByIdAndUpdate(userId,{ firstName: "Harry" })
        res.status(200).json({
            message:"User Updated Successfully"
        })
    }
    
    catch(err){
        console.error(err)
        res.status(500).json({
            message:"Internal Server Error"
        })
    }

})

module.exports = {
    profileRouter
}