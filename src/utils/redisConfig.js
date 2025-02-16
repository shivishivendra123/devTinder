const redis = require('redis');

// Create a Redis client
const redisClient = redis.createClient({
    socket: {
        host: 'localhost',  // Redis server hostname (default: localhost)
        port: 6379          // Redis port (default: 6379)
    }
});

// Handle connection events
redisClient.on('connect', () => console.log('Connected to Redis'));
redisClient.on('error', (err) => console.error('Redis Error:', err));

// Connect to Redis
(async () => {
    await redisClient.connect();
})();

module.exports = redisClient;
