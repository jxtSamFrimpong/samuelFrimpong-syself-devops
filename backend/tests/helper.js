const listHelper = require('../utils/list_helper')
const blogs = require('./listOfBlogs')

test('dummy returns one', () => {
    const blogs = []

    const result = listHelper.dummy(blogs)
    expect(result).toBe(1)
})

describe('total likes', () => {
    const listWithOneBlog = [
        {
            _id: '5a422aa71b54a676234d17f8',
            title: 'Go To Statement Considered Harmful',
            author: 'Edsger W. Dijkstra',
            url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
            likes: 5,
            __v: 0
        }
    ]

    test('when list has only one blog, equals the likes of that', () => {
        const result = listHelper.totalLikes(listWithOneBlog)
        expect(result).toBe(5)
    })

    test('most liked blog is', () => {
        const result = listHelper.favoriteBlog(blogs)
        expect(result).toEqual({ likes: 12, author: 'Edsger W. Dijkstra', title: 'Canonical string reduction' })
    })

    test('author with the most blog is', () => {
        const result = listHelper.mostBlogs(blogs);
        expect(result).toEqual({ author: 'Robert C. Martin', blogs: 3 })
    })

    test('author with the most likes is', () => {
        const result = listHelper.mostLikes(blogs)
        expect(result).toEqual({ author: 'Edsger W. Dijkstra', likes: 17 })
    })

})