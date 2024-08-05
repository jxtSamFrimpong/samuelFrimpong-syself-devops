const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blogs')
const User = require('../models/user')
const api = supertest('localhost:3003')
//const listOfBlogs = require('./listOfBlogs')

beforeEach(async () => {
    // let blogObject = new Blog(listOfBlogs)
    // await noteObject.save()
    // noteObject = new Note(initialNotes[1])
    // await noteObject.save()

    // for (let { author, title, url, likes } of listOfBlogs) {
    //     let blogObject = new Blog({ author, title, url, likes })
    //     await blogObject.save()
    // }
    await User.deleteMany({ maxTimeMS: 70000 })
    await Blog.deleteMany({ maxTimeMS: 50000 })
}, 200000)

var token = '';
var globalAddedBlogs = []
var globalDeletedBlogs = []
describe('/api/users', () => {
    test('adding a valid user is successful but adding same user is not and further login in', async () => {
        const body = { username: 'akwankwaahia', name: 'somebody', password: 'somebody' }
        const addedUser = await api.post('/api/users')
            .send(body)
        expect(addedUser.statusCode).toBe(201)
        expect(addedUser.body.username).toBe(body.username)
        const anotheruser = await api.post('/api/users')
            .send(body)
        expect(anotheruser.statusCode).toBe(400)
        expect(anotheruser.body.error).toMatch(/validation failed: username/)


        //console.log('LOGIN WITH CREDENTIALS')
        const loggedInUser = await api.post('/api/login')
            .send(body)
        expect(loggedInUser.statusCode).toBe(200)
        expect(loggedInUser.body.username).toBe(body.username)
        token = loggedInUser.body.token
        const allUsers = await api.get('/api/users')
            .set('Authorization', `Bearer ${token}`)
        expect(allUsers.statusCode).toBe(200)
        expect(allUsers.body.length).toBe(1)
        const choseUser = allUsers.body[0].id
        const chosenUser = await api.get(`/api/users/${choseUser}`)
            .set('Authorization', `Bearer ${token}`)
        expect(chosenUser.statusCode).toBe(200)
        expect(chosenUser.body.username).toEqual(body.username)
        //console.log(token)
    }, 200000)
})

describe('get all blogs', () => {
    test('get all blogs', async () => {
        const allBlogs = await api.get('/api/blogs')
        expect(allBlogs.statusCode).toBe(200)

        expect(allBlogs.header['content-type']).toMatch(/application\/json/)
        expect(allBlogs.body.length).toBe(0)
    }, 50000)
})

describe('create a blog', () => {
    test('create a specific blog with valid credentials is succesful', async () => {
        //console.log('token in "create a blog"', token)
        //Already logged in
        const body = { title: 'required', author: 'long enough name', url: 'localhost', likes: 2 }
        const createdBlog = await api.post('/api/blogs').set('Authorization', `Bearer ${token}`).send(body)

        expect(createdBlog.statusCode).toBe(201)
        const _keys = Object.keys(body)
        _keys.forEach(i => {
            expect(createdBlog.body[`${i}`]).toBe(body[`${i}`])
        })
        globalAddedBlogs.push(createdBlog.body.id)
    }, 100000)

    test('create a blog without likes is succesful', async () => {
        //Already logged in
        const body = { title: 'required', author: 'long enough name', url: 'localhost' }
        const createdBlog = await api.post('/api/blogs').set('Authorization', `Bearer ${token}`).send(body)
        expect(createdBlog.statusCode).toBe(201)
        const _keys = Object.keys(body)
        _keys.forEach(i => {
            expect(createdBlog.body[`${i}`]).toBe(body[`${i}`])
        })
        globalAddedBlogs.push(createdBlog.body.id)
    }, 50000)

    test('create with no title is unsuccesful', async () => {
        //Already logged in
        const body = { author: 'long enough name', url: 'localhost', likes: 2 }
        const createdBlog = await api.post('/api/blogs')
            .set('Authorization', `Bearer ${token}`)
            .send(body)
        expect(createdBlog.statusCode).toBe(400)
        expect(createdBlog.body.error).toMatch(/validation failed: title: Path `title` is required/)
    }, 50000)

    test('create a blog with short author name is unsuccesful', async () => {
        //Already logged in
        const body = { title: 'required', author: 'short', url: 'localhost', likes: 2 }
        const createdBlog = await api.post('/api/blogs')
            .set('Authorization', `Bearer ${token}`)
            .send(body)
        expect(createdBlog.statusCode).toBe(400)
        expect(createdBlog.body.error).toMatch(/Blog validation failed: author: Path/)
    }, 50000)

    test('create a without url is unsuccesful', async () => {
        //Already logged in
        const body = { title: 'required', author: 'long enough name', likes: 2 }
        const createdBlog = await api.post('/api/blogs')
            .set('Authorization', `Bearer ${token}`)
            .send(body)
        expect(createdBlog.statusCode).toBe(400)
        expect(createdBlog.body.error).toMatch(/Blog validation failed: url: Path `url` is required/)
    }, 50000)
})

describe('get a blog', () => {
    test('get a specific blog with wrong id format', async () => {
        //Already logged in
        const id = 'something'
        const getBlog = await api.get(`/api/blogs/${id}`)
            .set('Authorization', `Bearer ${token}`)
        expect(getBlog.statusCode).toBe(400)
        expect(getBlog.body.error).toMatch(/malformatted id/)
    }, 50000)

    test('get a specific blog with valid id format', async () => {
        //Already logged in
        const id = globalAddedBlogs[Math.floor(Math.random() * globalAddedBlogs.length)]
        const getBlog = await api.get(`/api/blogs/${id}`)
            .set('Authorization', `Bearer ${token}`)
        expect(getBlog.statusCode).toBe(200)
        expect(getBlog.body.title).toBe('required')
    }, 50000)

    test('get a specific blog with valid id format but wrong id returns 404', async () => {
        const randomStringsOfCorrectLength = (characters) => {
            let result = '';
            const charactersLength = characters.length;

            for (let i = 0; i < charactersLength; i++) {
                const randomIndex = Math.floor(Math.random() * charactersLength);
                const randomCharacter = characters.charAt(randomIndex);
                result += randomCharacter;
            }

            return result;
        }
        //Already logged in
        const id_ = globalAddedBlogs[Math.floor(Math.random() * globalAddedBlogs.length)]
        const id = randomStringsOfCorrectLength(id_)
        const getBlog = await api.get(`/api/blogs/${id}`)
            .set('Authorization', `Bearer ${token}`)
        expect(getBlog.statusCode).toBe(404)
    }, 50000)
})

describe('update a blog', () => {
    test('update a blog with valid id and payload successful', async () => {
        const id = globalAddedBlogs[Math.floor(Math.random() * globalAddedBlogs.length)]

        const refBlog = await api.get(`/api/blogs/${id}`)
            .set('Authorization', `Bearer ${token}`)

        const body = { ...refBlog.body, likes: refBlog.body.likes + 1 }

        const updatedBlog = await api.put(`/api/blogs/${id}`)
            .set('Authorization', `Bearer ${token}`)
            .send(body)

        expect(refBlog.statusCode).toBe(200)
        expect(updatedBlog.statusCode).toBe(200)
        expect(updatedBlog.body.likes).toBe(refBlog.body.likes + 1)

    }, 50000)

    test('update a blog with short author name unsuccessful 400 error', async () => {
        const id = globalAddedBlogs[Math.floor(Math.random() * globalAddedBlogs.length)]

        const refBlog = await api.get(`/api/blogs/${id}`)
            .set('Authorization', `Bearer ${token}`)

        const body = { ...refBlog.body, author: 'short' }

        const updatedBlog = await api.put(`/api/blogs/${id}`)
            .set('Authorization', `Bearer ${token}`)
            .send(body)

        expect(refBlog.statusCode).toBe(200)
        expect(updatedBlog.statusCode).toBe(400)
        expect(updatedBlog.body.error).toMatch(/Validation failed: author: Path `author`/)

    }, 50000)
})


describe('delete blogs', () => {
    test('delete a blog with valid id returns 204', async () => {
        const id = globalAddedBlogs[Math.floor(Math.random() * globalAddedBlogs.length)]

        const refBlogFirst = await api.get(`/api/blogs/${id}`)
            .set('Authorization', `Bearer ${token}`)

        const deletedBlog = await api.delete(`/api/blogs/${id}`)
            .set('Authorization', `Bearer ${token}`)

        const refBlogSec = await api.get(`/api/blogs/${id}`)
            .set('Authorization', `Bearer ${token}`)

        expect(refBlogFirst.statusCode).toBe(200)
        expect(deletedBlog.statusCode).toBe(204)
        expect(refBlogSec.statusCode).toBe(404)

        globalDeletedBlogs.push(id)

    }, 50000)

    test('delete a same deleted blog', async () => {
        const id = globalDeletedBlogs[Math.floor(Math.random() * globalDeletedBlogs.length)]

        const deletedBlog = await api.delete(`/api/blogs/${id}`)
            .set('Authorization', `Bearer ${token}`)

        const refBlog = await api.get(`/api/blogs/${id}`)
            .set('Authorization', `Bearer ${token}`)

        expect(deletedBlog.statusCode).toBe(204)
        expect(refBlog.statusCode).toBe(404)

    }, 50000)
})



afterAll(async () => {
    await Blog.deleteMany({ maxTimeMS: 50000 })
    await User.deleteMany({ maxTimeMS: 70000 })
    await mongoose.connection.close()
}, 200000)