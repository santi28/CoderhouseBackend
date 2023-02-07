const formatHour = (date) => {
  const today = new Date()
  const messageDate = new Date(date)
  if (today.getDate() === messageDate.getDate()) {
    return `${messageDate.getHours()}:${messageDate.getMinutes()}`
  } else {
    return `${messageDate.getDate()}/${messageDate.getMonth()}/${messageDate.getFullYear()} ${messageDate.getHours()}:${messageDate.getMinutes()}`
  }
}

const MessageSendedComponent = (message) => {
  const { author, text, timestamp } = message

  return `
    <div class="flex w-full gap-2">
      <img src="${author.avatar}" class="w-[42px] h-[42px] rounded-full">
      <div class="flex flex-col gap-0.5 p-2 w-full rounded-xl self-end bg-green-200 rounded-br-none">
        <span class="font-bold">${author.alias}</span>
        <span class="text-sm">${text}</span>
        <span class="text-xs text-right italic">${formatHour(timestamp)}</span>
      </div>
    </div>
  `
}

const MessageRecivedComponent = (message) => {
  const { author, text, timestamp } = message

  return `
    <div class="flex flex-row-reverse w-full gap-2">
      <img src="${author.avatar}" class="w-[42px] h-[42px] rounded-full">
      <div class="flex flex-col gap-0.5 p-2 w-full rounded-xl self-end bg-zinc-200 rounded-bl-none">
        <span class="font-bold">${author.alias}</span>
        <span class="text-sm">${text}</span>
        <span class="text-xs text-right italic">${formatHour(timestamp)}</span>
      </div>
    </div>
  `
}

// eslint-disable-next-line no-undef
const authorSchema = new normalizr.schema.Entity(
  'authors',
  {},
  { idAttribute: 'id' }
)

// eslint-disable-next-line no-undef
const messageSchema = new normalizr.schema.Entity(
  'messages',
  { author: authorSchema },
  { idAttribute: '_id' }
)
;(async () => {
  // eslint-disable-next-line no-undef
  const socket = io()

  const chatImage = document.getElementById('chat-image')
  const chatEmail = document.getElementById('chat-email')
  const chatName = document.getElementById('chat-name')
  const chatSurname = document.getElementById('chat-surname')
  const chatAge = document.getElementById('chat-age')
  const chatUsername = document.getElementById('chat-username')
  const chatMessage = document.getElementById('chat-message')

  const chatForm = document.getElementById('chat-form')

  // eslint-disable-next-line no-undef
  socket.on('messages', (data) => {
    const chatContainer = document.getElementById('chatWrapper')

    // entities: {authors: {…}, messages: {…}}
    // result: ['63e2a6155e89e30ca090bc21', '63e2a6395e89e30ca090bc23', '63e2a64a5e89e30ca090bc25']

    // eslint-disable-next-line no-undef
    const denormalizedData = normalizr.denormalize(
      data.result,
      [messageSchema],
      data.entities
    )

    const normailzedBytes = JSON.stringify(data).length
    const denormalizedBytes = JSON.stringify(denormalizedData).length

    const optimizePercent = Math.round(
      // eslint-disable-next-line prettier/prettier
      100 - (normailzedBytes / denormalizedBytes) * 100
    )

    console.log(`Optimize: ${optimizePercent}%`)

    chatContainer.innerHTML = `
      <h3 class="text-lg italic ${
        optimizePercent < 0 ? 'text-red-600' : 'text-green-600'
      }">Chat optimized ${optimizePercent}%</h3>
    `

    denormalizedData.map((messagePayload) =>
      messagePayload.author.id === chatEmail.value
        ? (chatContainer.innerHTML += MessageSendedComponent(messagePayload))
        : (chatContainer.innerHTML += MessageRecivedComponent(messagePayload))
    )
  })

  socket.on('update-messages', (messagePayload) => {
    const chatContainer = document.getElementById('chatWrapper')

    messagePayload.author.id === chatEmail.value
      ? (chatContainer.innerHTML += MessageSendedComponent(messagePayload))
      : (chatContainer.innerHTML += MessageRecivedComponent(messagePayload))
  })

  chatEmail.addEventListener('change', () => {
    // eslint-disable-next-line no-undef
    const hash = CryptoJS.MD5(chatEmail.value).toString()
    const url = `https://www.gravatar.com/avatar/${hash}?d=retro`

    chatImage.src = url
  })

  chatForm.addEventListener('submit', async (event) => {
    event.preventDefault()

    // Verifica que el email, nombre, apellido, edad y nombre de usuario no estén vacíos
    if (
      !(
        chatEmail.value &&
        chatName.value &&
        chatSurname.value &&
        chatAge.value &&
        chatUsername.value &&
        chatMessage.value
      )
    )
      // eslint-disable-next-line no-undef
      return alert('Todos los campos son obligatorios')

    const chatPayload = {
      author: {
        id: chatEmail.value,
        nombre: chatName.value,
        apellido: chatSurname.value,
        edad: chatAge.value,
        alias: chatUsername.value,
        avatar: chatImage.src
      },
      text: chatMessage.value
    }

    console.log(chatPayload)
    // eslint-disable-next-line no-undef
    socket.emit('new-message', chatPayload)

    chatMessage.value = ''
  })
})()
