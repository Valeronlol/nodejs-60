const { Server } = require('socket.io')
const { createAdapter } = require('@socket.io/redis-adapter')
const { createClient } = require('redis')

const io = new Server({
  path: '/websocket'
})

const pubClient = createClient({ url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}` })
const subClient = pubClient.duplicate()

const port = parseInt(process.env.PORT) || 3000

io.on('connect', (socket) => {
  socket.username = socket.handshake.query.username

  socket.emit('info', {
    CONTAINER_ID: process.env.CONTAINER_ID
  })

  socket.on('sendMessage', (data) => {
    io.emit('broadcastMessage', {
      data,
      author: socket.username,
      time: (new Date()).toISOString(),
    })
  })
})

async function main () {
  await Promise.all([pubClient.connect(), subClient.connect()])
  io.adapter(createAdapter(pubClient, subClient))
  io.listen(port)
  console.log(`Websocket server ${process.env.CONTAINER_ID} listening on port ${port}`)
}
main()
