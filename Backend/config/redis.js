const redis = require('redis')
const env = require('dotenv').config()

const client = redis.createClient({
  password: process.env.REDIS_PASSWORD,
  socket: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT
  }
})
client.on('error', (err) => console.log('Error: ', err))
client
  .connect()
  .then(() => console.log('redis conectado'))
  .catch((err) => console.log(err))

module.exports = client
