const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    firstName : {
        type: String,
    },
    lastName : {
        type: String,
    },
    emailId : {
        type : String,
        unique: true
    },
    password : {
        type : String,
       
    },
    age: {
        type : Number
    },
    gender :{
        type : String
    }
})

const userModel = mongoose.model('User1', userSchema)

module.exports = {
    userModel
}