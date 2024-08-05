const express = require('express')
const mongoose = require('mongoose')
//const Blog = require('./models/blogs')
require('express-async-errors')
const app = express()
const cors = require('cors')
const config = require('./utils/config')
const logger = require('./utils/logger')
const blogsRouter = require('./controllers/blogs')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')
const { unknownEndpoint, errorHandler, requestLogger, getTokenFrom, TokenUserExtractor, ExceptFromToken } = require('./middlewares/middle')

mongoose.set('strictQuery', false)

logger.info('connecting to', config.MONGODB_URI)

mongoose.connect(config.MONGODB_URI)
    .then(() => {
        logger.info('connected to MongoDB')
    })
    .catch((error) => {
        logger.error('error connecting to MongoDB:', error.message)
    })

app.use(cors())
app.use(express.json())
app.use(requestLogger)
app.use(ExceptFromToken)
app.use(getTokenFrom)

app.get('/', (req, res) => {
    res.send('<h1>Hello, Welcome to my blog</h1>')
})
app.use('/api/login', loginRouter)
// app.use(TokenUserExtractor)
app.use('/api/blogs', TokenUserExtractor, blogsRouter)
app.use('/api/users', TokenUserExtractor, usersRouter)


app.use(unknownEndpoint)
app.use(errorHandler)

module.exports = app;