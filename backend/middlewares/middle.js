/* eslint-disable indent */
const logger = require('../utils/logger')
const jwt = require('jsonwebtoken')

const unknownEndpoint = (request, response, next) => {
    response.status(404).send({ error: 'unknown endpoint' });
    next()
}

const errorHandler = (error, request, response, next) => {
    logger.error(error.message)

    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id' })
    }
    else if (error.name === "ValidationError") {
        return response.status(400).json({ error: error.message })
    } else if (error.name === 'JsonWebTokenError') {
        //console.log(request.token)
        return response.status(400).json({ error: error.message })
    } else if (error.name === 'TokenExpiredError') {
        return response.status(401).json({
            error: 'token expired'
        })
    }
    else {
        response.status(500).end();
    }

    next(error)
}

const requestLogger = (request, response, next) => {
    logger.info('Method:', request.method)
    logger.info('Path:  ', request.path)
    logger.info('Body:  ', request.body)
    logger.info('---')
    next()
}

const newestID = (notes) => {
    const maxId = notes.length > 0
        ? Math.max(...notes.map(n => n.id))
        : 0
    return maxId + 1
}

const getTokenFrom = (request, response, next) => {
    //logger.info(request.path === '/api/users' && request.method === 'POST')
    //logger.info(request.path, request.method)
    if (request.exceptFromToken) {
        return next()
    }
    const authorization = request.get('authorization')
    if (authorization && authorization.startsWith('Bearer ')) {
        request.token = authorization.replace('Bearer ', '')
    }
    else {
        request.token = null
    }
    next()
}

class PasswordError extends Error {
    constructor(message) {
        super(message);
        this.name = 'ValidationError';
    }
}

class TokenError extends Error {
    constructor(message) {
        super(message);
        this.name = 'JsonWebTokenError';
    }
}

const TokenUserExtractor = (request, response, next) => {
    //logger.info(request.path === '/api/users' && request.method === 'POST')
    //logger.info(request.path, request.method)
    if (request.exceptFromToken) {
        return next()
    }
    const decodedToken = jwt.verify(request.token, process.env.SECRET)
    //logger.info('decoded token', decodedToken)
    if (decodedToken.id === null || decodedToken.id === undefined) {
        throw new TokenError('invalid token')
    }
    else {
        request.tokenUser = decodedToken.id
        request.tokenUserName = decodedToken.username
    }
    next()
}

const ExceptFromToken = (req, res, next) => {
    //(req.path === '/api/blogs' && req.method === 'GET')
    if (req.path === '/api/users' && req.method === 'POST') {
        req.exceptFromToken = true
    } else {
        req.exceptFromToken = false
    }
    next()
}
module.exports = {
    unknownEndpoint,
    errorHandler,
    newestID,
    requestLogger,
    getTokenFrom,
    TokenUserExtractor,
    ExceptFromToken
}