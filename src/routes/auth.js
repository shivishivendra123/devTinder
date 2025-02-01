const express = require('express')
const bcrypt = require('bcryptjs')
const authRouter = express.Router()
const { validateSignUpData } = require('../utils/validator')
const jwt = require('jsonwebtoken')
const cookieParser = require('cookie-parser')
const { userModel } = require('../models/user')



authRouter.use(cookieParser())

authRouter.post('/v1/signup',async(req,res)=>{

    const { firstName , lastName , emailId , password , age , gender} = req.body

    let userObjfromReq = {
        firstName : firstName,
        lastName : lastName,
        emailId : emailId,
        password : password,
        age: age,
        gender : gender
    }

    console.log(userObjfromReq)

    const userObj = {
        firstName : 'Shivendra',
        lastName : 'Gupta',
        emailId : 'sh@gh.com',
        password : "password123",
        age: 5,
        gender : 'Male'
    }

    try{
        
        validateSignUpData(req)

        var password_enc = await bcrypt.hash(password,10)
        console.log(password_enc)

        userObjfromReq = {
            firstName : firstName,
            lastName : lastName,
            emailId : emailId,
            password : password_enc,
            age: age,
            gender : gender
        }

        const user = new userModel(userObjfromReq)
        await user.save()
        console.log("User Created")
        res.status(200).json({
            message:"User Created"
        })  
    }
    catch(err){
        console.log(err)
        res.status(500).json({
            message: err.message
        })
    }
    
    
})


authRouter.post('/v1/signIn',async(req,res)=>{
    const  { email , password } = req.body
 
    try{
     const user_cred = await userModel.findOne({emailId:email})
     console.log(password)
     if(!user_cred){
         res.send({
             message:"Invalid Username"
         })
     }
     if(await bcrypt.compare(password,user_cred.password)){
         console.log("Auth Success")
 
         const date = new Date()
 
         const token = user_cred.getJwt();
         console.log(token)
 
         res.cookie("token",token,{httpOnly: true, expires:new Date(Date.now() + 8 * 60 * 60 * 1000)})
         res.send({
             user_cred
         })
     }else{
         res.send({
             message:"Wrong Password"
         })
     }
     
    }
     catch(err){
         console.log(err.message)
         res.send({
             message:err.message
         })
     }
 
 })

 authRouter.post('/v1/logout',(req,res)=>{
    const cookies = req.cookies
    const { token } = cookies

    res.cookie("token",null,{expires: new Date(Date.now())})
    res.send({
        token: token
    })
 })

 module.exports = {
    authRouter
 }