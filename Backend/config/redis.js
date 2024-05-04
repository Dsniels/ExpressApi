const redis = require('redis')

const client = redis.createClient({ host: 'localhost', port: 6379 })
client.on('error', (err) => console.log('Error: ', err))
client
  .connect()
  .then(() => console.log('redis conectado'))
  .catch((err) => console.log(err))

module.exports = client
