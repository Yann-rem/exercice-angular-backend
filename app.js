const express = require('express')
const cors = require('cors')
const conversationRoutes = require('./routes/conversation.routes')
const authRoutes = require('./routes/auth.routes')

const app = express()

app.use(cors())
app.use(express.json())
app.use('/auth', authRoutes)
app.use('/conversations', conversationRoutes)

app.get('/', (request, response) => {
  response.send('<h1>Hello depuis app.js !')
})

module.exports = app
