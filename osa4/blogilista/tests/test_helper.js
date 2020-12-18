const Blog = require('../models/blog')

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

const nonExistentID = async () => {
  const blog = new Blog({ title: 'xxx', url: 'xxx' })
  await blog.save()
  await blog.remove()

  return blog._id.toString()
}

const currentDB = async() => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

module.exports = {
  initialBlogs,
  nonExistentID,
  currentDB
}