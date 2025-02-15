const socket = require('socket.io')
const { ChatModel } = require('../models/chat')

const initialSocket = (server) => {
    const io = socket(server, {
        cors: {
            origin: "http://localhost:5173"
        }
    })


    io.on("connection", (socket) => {
        socket.on('joinChat', ({ user_found, to }) => {
            try {
                let room_id = [user_found, to].sort().join("_")
                socket.join(room_id)
                console.log("Joining Room" + " " + room_id)
            }
            catch (err) {
                console.log(err.message)
            }

        })

        socket.on("sendmessage", async ({ sender, message_, user_found, to }) => {

            try {
                let query = await ChatModel.findOne({
                    participants: { $all: [user_found, to] }
                })
                if (!query) {
                    query = new ChatModel({
                        participants: [user_found, to],
                        text:[]
                    })
                }
                query.text.push({
                    senderId: user_found,
                    text: message_
                })

                query.save()
                let room_id = [user_found, to].sort().join("_")
                console.log(message_)
                let message = message_
                io.to(room_id).emit("messageReceived", { sender, message, user_found, to })


            } catch (err) {
                console.log(err.message)
            }
        })

    })



}

module.exports = {
    initialSocket
}