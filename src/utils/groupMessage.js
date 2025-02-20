const amqp = require('amqplib');

async function sendNotificationGroup(roomId, type, data) {
    try {
        const connection = await amqp.connect('amqp://localhost');
        const channel = await connection.createChannel();
        const queue = 'groupNotify';

        // Create a queue (if it doesn't exist)
        await channel.assertQueue(queue, { durable: false });

        // Send the message
        const message = JSON.stringify({ roomId, type, data });
        channel.sendToQueue(queue, Buffer.from(message));

        console.log(`Notification sent: ${message}`);

        // Close the connection
        setTimeout(() => {
            connection.close();
        }, 500);
    } catch (error) {
        console.error('Error sending notification:', error);
    }
}

module.exports = {
    sendNotificationGroup
}