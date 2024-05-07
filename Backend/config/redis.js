const redis  = require('redis');
const env = require('dotenv').config();

const client = redis.createClient({url : process.env.REDIS_URL});
client.on('error', err => console.log('Error: ', err));
client.connect().then(() => console.log('redis conectado')).catch(err => console.log(err));

module.exports = client;
