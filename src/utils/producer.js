const amqp = require('amqplib');

async function sendNotification(userId, type, data) {
    try {
        const connection = await amqp.connect('amqp://localhost');
        const channel = await connection.createChannel();
        const queue = 'notifications';

        // Create a queue (if it doesn't exist)
        await channel.assertQueue(queue, { durable: false });

        // Send the message
        const message = JSON.stringify({ userId, type, data });
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
    sendNotification
}