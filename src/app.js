const express = require('express')
const mongoose = require('mongoose')
const app = express()
const { userModel } = require('./models/user')
const cookieParser = require('cookie-parser')
const { auth_request } = require('./middlewares/authorize')
const { profileRouter } = require('./routes/profile')
const cors = require('cors')
const { authRouter } = require('./routes/auth')


const { requestsRouter } = require('./routes/requests')
// Route Order matters
const { Schema } = mongoose

const { connect_db } = require('./config/database')
const { userRouter } = require('./routes/user')
const { messageModel } = require('./models/messages')
const { messageRouter } = require('./routes/chat')

app.use(express.json())
app.use(cookieParser())

app.use(cors({
    origin:'http://localhost:5173',
    credentials: true
}))

app.use('/',authRouter)
app.use('/',profileRouter)
app.use('/',requestsRouter)
app.use('/',userRouter)
app.use('/',messageRouter)




app.get('/',(req,res)=>{
    res.json({
        message:"Hey this is a message"
    })
})

// app.get('/test',(req,res)=>{
//     res.json("hiiiiii")
// })

// app.get('/test/:id',(req,res)=>{
//     const id = req.params.id
//     console.log(id)
//     res.json("hiiiiii 2")
// })

//app.use route handler if usetest/something will also work
// app.get('/usetest',(req,res)=>{
//     res.json("axxaxax")
// })

// app.use('/',(err,req,res,next)=>{
//     res.status(500).send("Some went wrong")
// })


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

connect_db().then(()=>{
    app.listen("4000",()=>{
        console.log("DB connection successful")
        console.log("Listening of port 4000")
    })
})
.catch((err)=>{
    console.error("This is an error")
})

