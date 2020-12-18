const Blog = require('../models/blog')
const User = require('../models/user')

const initialBlogs = [
  {
    author: 'Mervi',
    title: 'Pellavasydän',
    url: 'https://www.blogit.fi/pellavasydän',
    likes: 10
  },
  {
    author: 'Marika',
    title: 'Marikan koruilut',
    url: 'https://www.blogit.fi/marikan-koruilut',
    likes: 9
  }
]

const initialUsers = [
  {
    username: 'root',
    name: 'Anne Alainen',
    passwordHash: 'TosiSalainen'
  },
  {
    username: 'alainene',
    name: 'Eeva Alainen',
    passwordHash: 'JokseenkinSalainen'
  }
]

const nonExistentID = async () => {
  const blog = new Blog({ title: 'xxx', url: 'xxx' })
  await blog.save()
  await blog.remove()

  return blog._id.toString()
}

const currentBlogDB = async() => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

const currentUserDB = async() => {
  const users = await User.find({})
  return users.map(user => user.toJSON())
}

module.exports = {
  initialBlogs,
  initialUsers,
  nonExistentID,
  currentBlogDB,
  currentUserDB
}