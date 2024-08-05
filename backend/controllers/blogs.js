const blogsRouter = require('express').Router()
const Blog = require('../models/blogs')
const logger = require('../utils/logger')
const User = require('../models/user')



blogsRouter.get('/', async (request, response, next) => {
    const allBlogs = await Blog.find({}).populate('user', { username: request.tokenUserName, name: 1 })
    response.json(allBlogs)

})

blogsRouter.get('/:id', async (request, response, next) => {
    const { id } = request.params;
    const foundBlog = await Blog.findById(id).populate('user', { username: 1 });
    if (foundBlog === null) {
        return response.status(404).json(null)
    }
    if (request.tokenUser !== foundBlog.user.id) {
        return response.status(401).json({ error: 'invalid token' })
    }

    response.json(foundBlog)
})

blogsRouter.post('/', async (request, response, next) => {
    const { title, author, url, likes } = request.body

    const user = await User.findById(request.tokenUser);

    const blog = new Blog({ title, author, url, likes, user: user.id })
    const savedBlog = await blog.save()

    user.blogs = user.blogs.concat(savedBlog.id)
    await user.save()

    response.status(201).json(savedBlog)

})

blogsRouter.put('/:id', async (request, response, next) => {
    const { id } = request.params;
    const { title, author, url, likes } = request.body

    const blog = await Blog.findById(id)

    if (request.tokenUser !== blog.user.toString()) {

        return response.status(401).json({ error: 'invalid token' })
    }

    const updatedBlog = await Blog.findByIdAndUpdate(id, { title, author, url, likes }, { new: true, runValidators: true, context: 'query' })
    response.json(updatedBlog)

})

blogsRouter.delete('/:id', async (request, response, next) => {
    const { id } = request.params;

    const blog = await Blog.findById(id)
    if (blog === null) {
        return response.status(204).end()
    }

    if (request.tokenUser !== blog.user.toString()) {
        return response.status(401).json({ error: 'invalid token' })
    }

    const removedBlog = await Blog.findByIdAndRemove(id)
    response.status(204).json(removedBlog)
})

module.exports = blogsRouter;