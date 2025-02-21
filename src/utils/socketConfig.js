const socket = require('socket.io')
const { ChatModel } = require('../models/chat')
const { groupModel } = require('../models/group')
const amqp = require('amqplib');
const { sendNotification } = require('./producer');
const redisClient = require('./redisConfig');
const { sendNotificationGroup } = require('./groupMessage');
const { notifyModel } = require('../models/notification');

const checkForGroupUsers = async (roomId) => {
    const group = await groupModel.findById(roomId)

    let online_usrs = []
    let offline_urs = []
    if (group) {
        online_usrs = await Promise.all(group?.participants.map(async (value, index) => {
            const status = await redisClient.get(`user:${value}:status`)
            if (status == 'online') {
                return value

            } else {
                offline_urs.push(value)
                return null
            }
        }))
    }

    const filteredOnlineUsers = online_usrs.filter(user => user !== null);

    return [filteredOnlineUsers, group?.name, offline_urs]

}

const initialSocket = (server) => {
    const io = socket(server, {
        cors: {
            origin: "http://localhost:5173"
        }
    })

    async function setupGroupNotifyConsumer() {
        try {
            const connection = await amqp.connect('amqp://localhost');
            const channel = await connection.createChannel();
            const queue = 'groupNotify';

            // Create a queue (if it doesn't exist)
            await channel.assertQueue(queue, { durable: false });

            console.log('Waiting for messages...');

            // Consume messages from the queue
            channel.consume(queue, async (message) => {
                if (message != null) {
                    obj = JSON.parse(message.content.toString())
                    console.log(obj.roomId)
                    const [online_users, name, offline_urs] = await checkForGroupUsers(obj.roomId)

                    online_users.forEach(element => {
                        console.log(obj)
                        io.to(element.toString()).emit('connection', { notification: `Message from ${name} group: ${obj.data}` });
                    });
                    offline_urs.forEach(async (element) => {
                        console.log(element)
                        try {
                            const notication_to_save = new notifyModel({
                                userId: element,
                                message: `Message from ${name} group: ${obj.data}`,
                                status: 'unseen'
                            })
                            await notication_to_save.save()
                        } catch (err) {
                            console.log(err.message)
                        }
                    })
                }
            });
            process.on('SIGINT', async () => {
                console.log("Closing RabbitMQ connection...");
                await channel.close();
                await connection.close();
                process.exit(0);
            });
            channel.ack(message);
        } catch (error) {
            console.error('Error setting up RabbitMQ:', error);
        }
    }

    setupGroupNotifyConsumer()

    async function setupRabbitMQ() {
        try {
            const connection = await amqp.connect('amqp://localhost');
            const channel = await connection.createChannel();
            const queue = 'notifications';

            // Create a queue (if it doesn't exist)
            await channel.assertQueue(queue, { durable: false });

            console.log('Waiting for messages...');

            // Consume messages from the queue
            channel.consume(queue, async (message) => {
                if (message !== null) {
                    const notification = JSON.parse(message.content.toString());
                    console.log('Received notification:', notification);


                    const status = await redisClient.get(`user:${notification.userId}:status`)
                    if (status == 'online') {
                        console.log("online")
                        io.to(notification.userId).emit('connection', { notification: notification.data });
                    } else {
                        try {
                            const notication_to_save = new notifyModel({
                                userId: notification.userId,
                                message: notification.data,
                                status: 'unseen'
                            })
                            await notication_to_save.save()
                        } catch (err) {
                            console.log(err.message)
                        }
                    }

                    // Handle process exit
                    

                    channel.ack(message);
                    process.on('SIGINT', async () => {
                        console.log("Closing RabbitMQ connection...");
                        await channel.close();
                        await connection.close();
                        process.exit(0);
                    });
                }
            });
        } catch (error) {
            console.error('Error setting up RabbitMQ:', error);
        }
    }

    setupRabbitMQ()

    io.on("connection", (socket) => {

        socket.on('joinNotificationService', ({ room }) => {
            socket.join(room)
            console.log("Joined notication" + room)
        })

        socket.on('sentInterestedRequest', ({ message, type, id }) => {
            console.log(message + type + id)
            sendNotification(id, type, message)
        })

        socket.on('receivedchat', ({ userId, firstName, text }) => {
            console.log(userId)
            console.log(firstName)
            console.log(text)

        })

        socket.on('requestAccept', ({ to_user, accept_by }) => {
            console.log(to_user._id)
            console.log(accept_by)
            console.log(to_user + accept_by)
            sendNotification(to_user._id, 'notification', accept_by.firstName + " accepted your connection request")
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
            sendNotificationGroup(room_id, 'sentMessage', message)
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
                sendNotification(to, "notification", sender + " sent you a message: " + message)

            } catch (err) {
                console.log(err.message)
            }
        })

    })



}

module.exports = {
    initialSocket
}