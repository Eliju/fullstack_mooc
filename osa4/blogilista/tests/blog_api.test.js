const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../App')
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

beforeEach(async () => {
  await Blog.deleteMany({})
  let blogObject = new Blog(initialBlogs[0])
  await blogObject.save()
  blogObject = new Blog(initialBlogs[1])
  await blogObject.save()
})

const api = supertest(app)

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('there are two blogs saved', async () => {
  const response = await api.get('/api/blogs')
  expect(response.body).toHaveLength(initialBlogs.length)
})

test('blogs contain one with a title Marikan koruilut', async () => {
  const response = await api.get('/api/blogs')

  const titles = response.body.map(b => b.title)

  expect(titles).toContain('Marikan koruilut')
})

test('blogs contain id field', async () => {
  const response = await api.get('/api/blogs')
  expect(response.body[0].id).toBeDefined() && expect(response.body[0]._id).not.toBeDefined()
})

test('blog is added', async() => {
  const newBlog = {
    author: 'BearFi73',
    title: 'Motoristinallen matkakertomuksia',
    url: 'https://ranneliike.net/blogit/motoristinallen-matkakertomuksia',
    likes: 34
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)  //Status === created
    .expect('Content-Type',/application\/json/)

  const res = await api.get('/api/blogs')
  const blogTitles = res.body.map(b => b.title)

  expect(res.body).toHaveLength(initialBlogs.length + 1)
  expect(blogTitles).toContain(newBlog.title)
})

test('blog without author is not added', async () => {
  const newBlog = {
    title: 'Motoristinallen matkakertomuksia',
    url: 'https://ranneliike.net/blogit/motoristinallen-matkakertomuksia',
    likes: 34
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect({ error: 'Blog validation failed: author: Path `author` is required.' })
    .expect(400)

  const res = await api.get('/api/blogs')
  const blogTitles = res.body.map(b => b.title)

  expect(res.body).toHaveLength(initialBlogs.length)
  expect(blogTitles).not.toContain(newBlog.title)
})

test('blog without title is not added', async () => {
  const newBlog = {
    author: 'BearFi73',
    url: 'https://ranneliike.net/blogit/motoristinallen-matkakertomuksia',
    likes: 34
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect({ error: 'Blog validation failed: title: Path `title` is required.' })
    .expect(400)

  const res = await api.get('/api/blogs')
  const blogURLs = res.body.map(b => b.url)

  expect(res.body).toHaveLength(initialBlogs.length)
  expect(blogURLs).not.toContain(newBlog.url)
})

test('blog without url is not added', async () => {
  const newBlog = {
    author: 'BearFi73',
    title: 'Motoristinallen matkakertomuksia',
    likes: 34
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect({ error: 'Blog validation failed: url: Path `url` is required.' })
    .expect(400)

  const res = await api.get('/api/blogs')
  const blogTitles = res.body.map(b => b.title)

  expect(res.body).toHaveLength(initialBlogs.length)
  expect(blogTitles).not.toContain(newBlog.title)
})


afterAll(async () => {
  await mongoose.connection.close()
})
