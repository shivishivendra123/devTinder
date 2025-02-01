
const jwt = require('jsonwebtoken')

const auth_request = (req,res,next)=>{

    const cookies = req.cookies
    let se_token = (cookies.token)

    jwt.verify(se_token,'cgajvcjavcuv',(err,user)=>{
        if(err){
            res.status(401).json({
                message:err
            })
        }else{
            req.user = user._id
            next()
        }
    })
} 


module.exports =  {
    auth_request
}