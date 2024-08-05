const dummy = (blogs) => {
    return 1;
}

const totalLikes = (blogs) => {
    const blog_likes = blogs.map(blog => blog.likes)
    const sum_blog_likes = blog_likes.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
    return sum_blog_likes;
}

const favoriteBlog = (blogs) => {
    const mostLiked = blogs.reduce((maxObj, currentObj) => {
        if (currentObj.likes > maxObj.likes) {
            return currentObj;
        } else {
            return maxObj;
        }
    }, blogs[0]);

    const { likes, author, title } = mostLiked;

    return { likes, author, title }
}

const mostBlogs = (blogs) => {
    const blogLeader = {}
    blogs.map(blog => {
        blogLeader[`${blog.author}`] === undefined ?
            blogLeader[`${blog.author}`] = 1 :
            blogLeader[`${blog.author}`] = blogLeader[`${blog.author}`] + 1
    })

    const actBlogLeader = Object.keys(blogLeader).reduce((max, current) => {
        if (blogLeader[`${current}`] > blogLeader[`${max}`]) {
            return current
        }
        else {
            return max
        }
    }, Object.keys(blogLeader)[0])
    //console.log(actBlogLeader)
    return { author: actBlogLeader, blogs: blogs.filter(blog => blog.author === actBlogLeader).length };
}

const mostLikes = (blogs) => {
    const likesLeaderBoard = {}
    blogs.map(blog => {
        likesLeaderBoard[`${blog.author}`] == undefined ?
            likesLeaderBoard[`${blog.author}`] = blog.likes :
            likesLeaderBoard[`${blog.author}`] += blog.likes
    })
    const actualLikesLeader = Object.keys(likesLeaderBoard).reduce((max, current) => {
        if (likesLeaderBoard[`${current}`] > likesLeaderBoard[`${max}`]) {
            return current
        }
        else {
            return max
        }
    }, Object.keys(likesLeaderBoard)[0])

    return { author: actualLikesLeader, likes: likesLeaderBoard[`${actualLikesLeader}`] }
}

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes
}