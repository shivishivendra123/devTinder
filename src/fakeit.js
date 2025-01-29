
const mongoose = require('mongoose')
const { connect_db } = require('./config/database')
const { userModel } = require('./models/user')
const { faker } = require('@faker-js/faker')

connect_db().then(async ()=>{
    const generateUser = ()=>{
        return {
            firstName: faker.person.firstName(),
            lastName: faker.person.lastName(),
            emailId: faker.internet.email(),
            password: faker.internet.password(),
            age: faker.number.int({ min: 18, max: 80 }), // Updated method for generating numbers
            gender: faker.helpers.arrayElement(['Male', 'Female', 'Other'])
        }
    }
    

    const users = Array.from({ length : 10000},generateUser)

    console.log(users)

    await userModel.insertMany(users)

      console.log("Inserted dummy data")

     


})
.catch((err)=>{
    console.error(err)
})