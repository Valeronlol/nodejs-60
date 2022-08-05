$(() => {
  const welcomeForm = $('#welcome-form')
  const welcome = $('#welcome')

  let socket = null

  const subscribeEvents = (socket) => {
    socket.on('info', ({ CONTAINER_ID }) => {
      console.log(`CONSOLE: CONTAINER_ID`, CONTAINER_ID)
      $('#container-id').empty()
      $(`<span>${CONTAINER_ID}</span>`).appendTo('#container-id')
    })

    socket.on('broadcastMessage', ({ author, data, time }) => {
      $(`<p title="${time}" class="message">${author}: ${data.text}</p>`).appendTo('#messages-container')
    })
  }

  welcomeForm.submit((event) => {
    event.preventDefault()

    const username = $('#welcome-form-username').val()
    socket = io('http://localhost:3000/', {
      path: '/websocket',
      transports: ['websocket'],
      query: { username }
    })

    subscribeEvents(socket)
    welcome.remove()
    $('#chat ').css('display', 'flex')
  })

  $('#chat-message-form').submit((event) => {
    event.preventDefault()
    const message = $('#chat-message')
    socket.emit('sendMessage', {
      text: message.val()
    })
    message.val('')
  })
})