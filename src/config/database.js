const mongoose = require('mongoose')

const connect_db = async()=>{
   return await mongoose.connect('mongodb+srv://shivendragupta104:8zFQt5qUOCTBbc4Q@cluster0.zejaq.mongodb.net/test2')
}

module.exports = {
    connect_db
}

