const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../App')
const Blog = require('../models/blog')
const initialBlogs = [
  {
    author: "Mervi",
    title: "Pellavasydän",
    url: "https://www.blogit.fi/pellavasydän",
    likes: 10
  },
  {
    author: "Marika",
    title: "Marikan koruilut",
    url: "https://www.blogit.fi/marikan-koruilut",
    likes: 9
  }
]

beforeEach(async () => {
  await Blog.deleteMany({})
  let blogObject = new Blog(initialBlogs[0])
  await blogObject.save()
  blogObject = new Blog(initialBlogs[1])
  await blogObject.save()
}

)

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

afterAll(() => {
  mongoose.connection.close()
})