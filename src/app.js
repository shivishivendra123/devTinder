const express = require('express')
const mongoose = require('mongoose')
const app = express()
const { userModel } = require('./models/user')

// Route Order matters
const { Schema } = mongoose

const { connect_db } = require('./config/database')

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

app.post('/signup',async(req,res)=>{
    const userObj = {
        firstName : 'Shivendra',
        lastName : 'Gupta',
        emailId : 'sh@gh.com',
        password : "password123",
        age: 5,
        gender : 'Male'
    }

    const user = new userModel(userObj)
    await user.save()
    console.log("User Created")
    res.status(200).json({
        message:"User Created"
    })
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

