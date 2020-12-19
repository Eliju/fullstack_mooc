const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

const getTokenFrom = req => {
  const authorization = req.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    return authorization.substring(7)    // returns token
  }
  return null
}

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('users', { 'name': 1, 'username': 1 })
  response.json(blogs.map(blog => blog.toJSON()))
})

blogsRouter.get('/:id', async (request, response) => {
  const blog = await Blog.findById(request.params.id)
  if (blog) {
    response.json(blog.toJSON())
  } else {
    response.status(404).end()
  }
})

blogsRouter.post('/', async (request, response) => {
  const body = request.body
  const token = getTokenFrom(request)
  const decToken = jwt.verify(token, process.env.SECRET_VALUE)
  if (!token || !decToken.id) {
    return response.status(401).json({ error: 'authorization token missing or invalid' })
  }
  const user = await User.findById(decToken.id)

  const blog = new Blog({
    author: body.author,
    title: body.title,
    url: body.url,
    likes: body.likes || 0,
    users: user._id
  })

  const res = await blog.save()
  user.blogs = user.blogs.concat(res._id)
  await user.save()

  response.json(res.toJSON())
})

blogsRouter.delete('/:id', async (request, response) => {
  const result = await Blog.findByIdAndDelete({ '_id': request.params.id })
  response.json(result)
})

blogsRouter.put('/:id', async (request, response) => {
  const data = request.body
  let updateBlog = {}
  if (data.likes > 0) {
    updateBlog = {
      author: data.author,
      title : data.title,
      url: data.url,
      likes: data.likes
    }
  } else {
    updateBlog = {
      author: data.author,
      title : data.title,
      url: data.url
    }
  }

  const updated = await Blog.findByIdAndUpdate(request.params.id, updateBlog, { new: true, runValidators: true })

  if (updated) {
    response.json(updated.toJSON())
  } else {
    response.status(404).end()
  }
})

module.exports = blogsRouter