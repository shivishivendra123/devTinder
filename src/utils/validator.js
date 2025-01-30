const validator = require('validator')

const validateSignUpData = (req) =>{
   const  { firstName , lastName , emailId } = req.body
   console.log(firstName)
   console.log(lastName)
   console.log(emailId)
    if(!firstName || !lastName){
        throw new Error("Enter a Valid name")
    }
    console.log("axa")
    if(!validator.isEmail(emailId)){
        console.log("aa")
        throw new Error("Enter a valid Email")
    }
}

module.exports = {
    validateSignUpData
}