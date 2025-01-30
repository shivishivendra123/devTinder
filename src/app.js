const express = require('express')
const mongoose = require('mongoose')
const app = express()
const { userModel } = require('./models/user')
const { validateSignUpData } = require('./utils/validator')
const bcrypt = require('bcryptjs')
const cookieParser = require('cookie-parser')
const jwt = require('jsonwebtoken')
const { auth_request } = require('./middlewares/authorize')
// Route Order matters
const { Schema } = mongoose

const { connect_db } = require('./config/database')

app.use(express.json())
app.use(cookieParser())



app.get('/',(req,res)=>{
    res.json({
        message:"Hey this is a message"
    })
})

app.get('/test',(req,res)=>{
    res.json("hiiiiii")
})

app.get('/test/:id',(req,res)=>{
    const id = req.params.id
    console.log(id)
    res.json("hiiiiii 2")
})

//app.use route handler if usetest/something will also work
app.get('/usetest',(req,res)=>{
    res.json("axxaxax")
})

app.use('/',(err,req,res,next)=>{
    res.status(500).send("Some went wrong")
})

app.post('/v1/signup',async(req,res)=>{

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

app.get('/v1/users',auth_request,async(req,res)=>{

    const all_users = await userModel.find({})
    
    try{
        res.status(200).json({
            all_users
        })
    }
    
    catch(err){
        res.status(500).json({
            err
        })
    }

})

app.get('/v1/getbyemail',auth_request,async(req,res)=>{

    const {email} = req.body
    try{
        const userByEmail = await userModel.findOne({ emailId : email})
        console.log(userByEmail)
        res.status(200).json(
            userByEmail
        )
    }
    
    catch(err){
        res.send({
            message:"Not a valid email address"
        })
    }
    
})

app.get('/v1/deleteUserById',async(req,res)=>{
    const { id } = req.body

    await userModel.deleteOne({ _id:id })

    res.status(200).json({
        message: `The use with userid ${ id} is deleted`
    })
})

app.patch('/v1/findByIDandUpdate',async(req,res)=>{
    const { userId }  = req.body

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

app.post('/v1/signIn',async(req,res)=>{
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

        const data = {
            email: email,
            issued_at: date 
        }

        const token = jwt.sign(data,"cgajvcjavcuv")
        console.log(token)

        res.cookie("token",token,{httpOnly: true})
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

connect_db().then(()=>{
    app.listen("4000",()=>{
        console.log("DB connection successful")
        console.log("Listening of port 4000")
    })
})
.catch((err)=>{
    console.error("This is an error")
})

