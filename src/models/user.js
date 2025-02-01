const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')

const userSchema = new mongoose.Schema({
    firstName : {
        type: String,
        required: true
    },
    lastName : {
        type: String,
    },
    emailId : {
        type : String,
        unique: true,
        required: true,
        validate(value){
            if(!(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))){
                throw new Error("Not a valid email")
            }   
        }
    },
    password : {
        type : String,
        required: true
       
    },
    age: {
        type : Number,
        required: true
    },
    gender :{
        type : String,
        required: true
    },
    photoURL :{
        type: String,
    },
    about:{
        type: String,
        default: "Hii this is Dev"
    },
    skills: {
        type: [String],
        validate(value){
            if(value.length > 10){
                throw new Error('Cannot Add More than 10 skills')
            }
        }

    }
},{
    timestamps: true
})

userSchema.methods.getJwt = function(){
    const user = this
    const data = {
        _id: this._id,
        issued_at: new Date() 
    }
    const token  = jwt.sign(data,"cgajvcjavcuv",{expiresIn:'1d'})

    return token
}

const userModel = mongoose.model('User', userSchema)

module.exports = {
    userModel
}