const { favoriteBlog, mostBlogs, mostLikes } = require('./list_helper')
const blogs = require('../tests/listOfBlogs')

console.log(mostLikes(blogs))