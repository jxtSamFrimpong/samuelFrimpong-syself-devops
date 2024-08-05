/* eslint-disable indent */
const usersRouter = require('express').Router()
const User = require('../models/user')
const Blog = require('../models/blogs')
const bcrypt = require('bcrypt')
// const jwt = require('jsonwebtoken')

class PasswordError extends Error {
    constructor(message) {
        super(message);
        this.name = 'ValidationError';
    }
}

usersRouter.post('/', async (request, response) => {
    const { username, name, password } = request.body
    if (password === undefined || password === null) {
        throw new PasswordError('User validation failed: password: Path `password` is required.')
    }
    if (password.length < 3) {
        throw new PasswordError('User validation failed: password: Error, expected password to be a string of at least 3 characters')
    }

    const saltRounds = 10
    const passwordHash = await bcrypt.hash(password, saltRounds)

    const user = new User({
        username,
        name,
        passwordHash,
    })

    const savedUser = await user.save()

    response.status(201).json(savedUser)
})

usersRouter.get('/', async (req, res) => {
    // if (req.tokenUserName !== 'akwankwaahia') {
    //     return res.status(401).json({ error: 'invalid token' })
    // }

    const allUsers = await User.find({}).populate('blogs', { author: 1, title: 1, url: 1 })
    res.json(allUsers)
})

usersRouter.get('/:id', async (req, res) => {

    if (req.tokenUser !== req.params.id) {
        return res.status(401).json({ error: 'invalid token' })
    }

    const thisuser = await User.findById(req.tokenUser).populate('blogs', { author: 1, title: 1, url: 1 })
    res.json(thisuser)
})

module.exports = usersRouter;