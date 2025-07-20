const express = require('express')
const cors = require('cors')
const connection = require('./config/db')
const conversationRoutes = require('./routes/conversation.routes')
const authRoutes = require('./routes/auth.routes')

const app = express()

app.use(cors())
app.use(express.json())
app.use('/conversations', conversationRoutes)
app.use('/auth', authRoutes(connection))

app.get('/', (request, response) => {
  response.send('<h1>Hello depuis app.js !')
})

module.exports = app
