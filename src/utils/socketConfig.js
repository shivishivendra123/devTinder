const socket = require('socket.io')
const { ChatModel } = require('../models/chat')
const { groupModel } = require('../models/group')
const amqp = require('amqplib');
const { sendNotification } = require('./producer');
const redisClient = require('./redisConfig');

const initialSocket = (server) => {
    const io = socket(server, {
        cors: {
            origin: "http://localhost:5173"
        }
    })

    async function setupRabbitMQ() {
        try {
            const connection = await amqp.connect('amqp://localhost');
            const channel = await connection.createChannel();
            const queue = 'notifications';
    
            // Create a queue (if it doesn't exist)
            await channel.assertQueue(queue, { durable: false });
    
            console.log('Waiting for messages...');
    
            // Consume messages from the queue
            channel.consume(queue, async(message) => {
                if (message !== null) {
                    const notification = JSON.parse(message.content.toString());
                    console.log('Received notification:', notification);
                

                   const status =  await redisClient.get(`user:${notification.userId}:status`)
                   if(status=='online'){
                        io.to(notification.userId).emit(notification.type, {notification:notification.data});
                   }
                    channel.ack(message);
                }
            });
        } catch (error) {
            console.error('Error setting up RabbitMQ:', error);
        }
    }
    
    setupRabbitMQ()

    io.on("connection", (socket) => {

        socket.on('joinNotificationService',({room})=>{
            socket.join(room)
            console.log("Joined notication"+room)
        })

        socket.on('sentInterestedRequest',({message,type,id})=>{
            console.log(message+type+id)
            sendNotification(id, type, message)
        })


        socket.on('joinGroupChat', ({ to }) => {
            let room_id = to
            socket.join(room_id)
            console.log("Joined group with room Id " + room_id)
        })

        socket.on('sendGroupMessage', async ({ room_id, message, sender, firstName }) => {
            console.log(message + room_id + "sender" + sender)

            try {
                const group_chat_obj = await groupModel.findById(room_id)

                group_chat_obj.text.push({
                    senderId: sender,
                    text: message
                })

                await group_chat_obj.save()
            }
            catch (err) {
                console.log(err.message)
            }


            io.to(room_id).emit('groupMessageRec', { sender_message: sender, mess_rec: message, firstName })
        })

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
                        text: []
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