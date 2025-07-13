const express = require("express");
const cors = require("cors");
const connection = require("./config/db")

const app = express()

app.use(cors());
app.use(express.json())

app.get("/", (request, response) => {
    response.send("<h1>Hello depuis app.js !")
});

const authRoutes = require('./routes/auth.routes');

app.use('/auth', authRoutes(connection));

module.exports = app;
