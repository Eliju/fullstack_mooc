const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

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
  const decToken = jwt.verify(request.token, process.env.SECRET_VALUE)
  if (!decToken.id) {
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
  const decToken = jwt.verify(request.token, process.env.SECRET_VALUE)
  if (!decToken.id) {
    return response.status(401).json({ error: 'authorization token missing or invalid' })
  }
  const blog = await Blog.findById(request.params.id)
  if (!blog) {
    return response.status(404).json({ error: 'blog not found - it might be already deleted' })
  } else {
    if (blog.users[0].toString() === decToken.id) {
      //const result = await Blog.findByIdAndDelete({ '_id': request.params.id })
      const result = await blog.delete()
      response.json(result)
    } else {
      return response.status(401).json({ error: 'not authorised to delete this blog' })
    }
  }
})

blogsRouter.put('/:id', async (request, response) => {
  const decToken = jwt.verify(request.token, process.env.SECRET_VALUE)
  if (!decToken.id) {
    return response.status(401).json({ error: 'authorization token missing or invalid' })
  }
  const data = request.body
  const blog = await Blog.findById(request.params.id)
  if (!blog) {
    return response.status(404).json({ error: 'blog not found - might be deleted' })
  }

  let updateBlog = {}
  if (data.likes > 0) {
    updateBlog = {
      author: data.author || blog.author,
      title : data.title || blog.title,
      url: data.url || blog.url,
      likes: data.likes || blog.url,
      users: blog.users
    }
  } else {
    updateBlog = {
      author: data.author || blog.author,
      title : data.title || blog.title,
      url: data.url || blog.url,
      users: blog.users
    }
  }

  if (blog.users[0].toString() === decToken.id) {
    const updated = await Blog.findByIdAndUpdate(request.params.id, updateBlog, { new: true, runValidators: true })

    if (updated) {
      response.json(updated.toJSON())
    } else {
      response.status(404).end()
    }
  } else {
    response.status(401).json({ error: 'authorization token missing or invalid' })
  }
})

module.exports = blogsRouter