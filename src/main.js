const { Server } = require('socket.io')

const io = new Server({
  path: '/websocket'
})

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

io.listen(port)
console.log(`Websocket server listening on port ${port}`)
