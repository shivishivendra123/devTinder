const mongoose = require('mongoose')

const connect_db = async()=>{
   return await mongoose.connect(process.env.DB_SECRET)
}

module.exports = {
    connect_db
}

