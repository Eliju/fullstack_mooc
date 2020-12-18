const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../App')
const Blog = require('../models/blog')
const helper = require('./test_helper')

const api = supertest(app)

describe('Database initialized with two blogs', () => {
  beforeEach(async () => {
    await Blog.deleteMany({})

    const blogs = helper.initialBlogs
      .map(blog => new Blog(blog))
    const promises = blogs.map(blog => blog.save())
    await Promise.all(promises)
  })

  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('there are two blogs saved', async () => {
    const response = await api.get('/api/blogs')
    expect(response.body).toHaveLength(helper.initialBlogs.length)
  })

  test('blogs contain one with a title Marikan koruilut', async () => {
    const response = await helper.currentBlogDB()

    const titles = response.map(b => b.title)

    expect(titles).toContain('Marikan koruilut')
  })

  test('blogs contain id field', async () => {
    const response = await helper.currentBlogDB()
    expect(response[0].id).toBeDefined() && expect(response[0]._id).not.toBeDefined()
  })
})


describe('Getting blog by id', () => {
  beforeEach(async () => {
    await Blog.deleteMany({})

    const blogs = helper.initialBlogs
      .map(blog => new Blog(blog))
    const promises = blogs.map(blog => blog.save())
    await Promise.all(promises)
  })

  test('blog can be fetched by id', async () => {
    const initDB = await helper.currentBlogDB()
    const blogToBeFetched = initDB[0]

    const fetchedBlog = await api
      .get(`/api/blogs/${blogToBeFetched.id}`)
      .expect(200)
      .expect('Content-Type',/application\/json/)

    expect(fetchedBlog.body).toEqual(JSON.parse(JSON.stringify(blogToBeFetched)))
  })

  test('fetching blog with non-existent id returns error', async () => {
    const nonExistentID = await helper.nonExistentID()

    await api
      .get(`/api/blogs/${nonExistentID}`)
      .expect(404)

  })

  test('fetching blog with non-valid id format returns error', async () => {
    const nonValidId = '1234asdf'

    await api
      .get(`/api/blogs/${nonValidId}`)
      .expect(400)
  })

})

describe('Blog addition', () => {
  beforeEach(async () => {
    await Blog.deleteMany({})

    const blogs = helper.initialBlogs
      .map(blog => new Blog(blog))
    const promises = blogs.map(blog => blog.save())
    await Promise.all(promises)
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
      .expect(200)  //Status === OK
      .expect('Content-Type',/application\/json/)

    const res = await helper.currentBlogDB()
    const blogTitles = res.map(b => b.title)

    expect(res).toHaveLength(helper.initialBlogs.length + 1)
    expect(blogTitles).toContain(newBlog.title)
  })

  /* test('blog without author is not added', async () => {
    const newBlog = {
      title: 'Motoristinallen matkakertomuksia',
      url: 'https://ranneliike.net/blogit/motoristinallen-matkakertomuksia',
      likes: 34
    }

    const initDB = await (await helper.currentBlogDB())

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect({ error: 'Blog validation failed: author: Path `author` is required.' })
      .expect(400)

    const res = await helper.currentBlogDB()
    const blogTitles = res.map(b => b.title)

    expect(res).toHaveLength(initDB.length)
    expect(blogTitles).not.toContain(newBlog.title)
  })
  */
  test('blog without title is not added', async () => {
    const newBlog = {
      author: 'BearFi73',
      url: 'https://ranneliike.net/blogit/motoristinallen-matkakertomuksia',
      likes: 34
    }

    const initDB = await helper.currentBlogDB()

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect({ error: 'Blog validation failed: title: Path `title` is required.' })
      .expect(400) // Status = Bad Request

    const res = await helper.currentBlogDB()
    const blogURLs = res.map(b => b.url)

    expect(res).toHaveLength(initDB.length)
    expect(blogURLs).not.toContain(newBlog.url)
  })

  test('blog without url is not added', async () => {
    const newBlog = {
      author: 'BearFi73',
      title: 'Motoristinallen matkakertomuksia',
      likes: 34
    }

    const initDB = await helper.currentBlogDB()

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect({ error: 'Blog validation failed: url: Path `url` is required.' })
      .expect(400) // Status = Bad Request

    const res = await helper.currentBlogDB()
    const blogTitles = res.map(b => b.title)

    expect(res).toHaveLength(initDB.length)
    expect(blogTitles).not.toContain(newBlog.title)
  })

  test('blog without like is added with 0 likes', async () => {
    const newBlog = {
      author: 'BearFi73',
      title: 'Motoristinallen matkakertomuksia',
      url: 'https://ranneliike.net/blogit/motoristinallen-matkakertomuksia'
    }

    const initDB = await helper.currentBlogDB()

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(200)  //Status === OK
      .expect('Content-Type',/application\/json/)

    const blogs = await helper.currentBlogDB()

    expect(blogs).toHaveLength(initDB.length + 1)
    const added = blogs.filter(b => ((b.author === newBlog.author) && (b.title === newBlog.title) && (b.url === newBlog.url)))
    expect(added.length).toBe(1)
    expect(added[0].likes).toBe(0)
  })
})

describe('Blog deletion', () => {
  beforeEach(async () => {
    await Blog.deleteMany({})

    const blogs = helper.initialBlogs
      .map(blog => new Blog(blog))
    const promises = blogs.map(blog => blog.save())
    await Promise.all(promises)
  })

  test('blog can be deleted by id', async () => {
    const initDB = await helper.currentBlogDB()
    const blogToBeDeleted = initDB[0]

    await api
      .delete(`/api/blogs/${blogToBeDeleted.id}`)
      .expect(200)

    const blogsLeft = await helper.currentBlogDB()
    const found = blogsLeft.filter(b => (b.id === blogToBeDeleted.id))
    expect(blogsLeft).toHaveLength(initDB.length - 1)
    expect(found).toHaveLength(0)
  })

  test('deletion with non-existent id returns error', async () => {
    const initDB = await helper.currentBlogDB()
    const blogToBeDeleted = helper.nonExistentID()

    await api
      .delete(`/api/blogs/${blogToBeDeleted.id}`)
      .expect(400)

    const blogsLeft = await helper.currentBlogDB()
    const found = blogsLeft.filter(b => (b.id === blogToBeDeleted.id))
    expect(blogsLeft).toHaveLength(initDB.length)
    expect(found).toHaveLength(0)
  })

  test('deletion with non-valid id format returns error', async () => {
    const initDB = await helper.currentBlogDB()
    const blogToBeDeleted = '1234asdf'

    await api
      .delete(`/api/blogs/${blogToBeDeleted.id}`)
      .expect(400)

    const blogsLeft = await helper.currentBlogDB()
    const found = blogsLeft.filter(b => (b.id === blogToBeDeleted.id))
    expect(blogsLeft).toHaveLength(initDB.length)
    expect(found).toHaveLength(0)
  })
})

describe('Blog update', () => {
  beforeEach(async () => {
    await Blog.deleteMany({})

    const blogs = helper.initialBlogs
      .map(blog => new Blog(blog))
    const promises = blogs.map(blog => blog.save())
    await Promise.all(promises)
  })

  test('update by id with all fields updated succeeds', async () => {
    const initDB = await helper.currentBlogDB()
    const blogToBeUpdated = initDB[0]

    const updates = {
      author: 'updated author',
      title: 'updated title',
      url: 'updated url',
      likes: blogToBeUpdated.likes + 10
    }

    const newValues = await api
      .put(`/api/blogs/${blogToBeUpdated.id}`)
      .send(updates)
      .expect(200)

    const updated = await api.get(`/api/blogs/${blogToBeUpdated.id}`)

    const newDB = await helper.currentBlogDB()
    expect(newDB.length).toBe(initDB.length)
    expect(newValues.body).toEqual(updated.body)
  })

  test('update by id without author field succeeds', async () => {
    const initDB = await helper.currentBlogDB()
    const blogToBeUpdated = initDB[0]

    const updates = {
      title: 'updated title',
      url: 'updated url',
      likes: blogToBeUpdated.likes + 10
    }

    const newValues = await api
      .put(`/api/blogs/${blogToBeUpdated.id}`)
      .send(updates)
      .expect(200)

    const updated = await api.get(`/api/blogs/${blogToBeUpdated.id}`)

    const newDB = await helper.currentBlogDB()
    expect(newDB.length).toBe(initDB.length)
    expect(newValues.body).toEqual(updated.body)
  })

  test('update by id without title field gives an error', async () => {
    const initDB = await helper.currentBlogDB()
    const blogToBeUpdated = initDB[0]

    const updates = {
      author: 'updated author',
      url: 'updated url',
      likes: blogToBeUpdated.likes + 10
    }

    await api
      .put(`/api/blogs/${blogToBeUpdated.id}`)
      .send(updates)
      .expect(400)

    const updated = await api.get(`/api/blogs/${blogToBeUpdated.id}`)

    const newDB = await helper.currentBlogDB()
    expect(newDB.length).toBe(initDB.length)
    expect(updated.body).toEqual(blogToBeUpdated)
  })

  test('update by id without url field gives an error', async () => {
    const initDB = await helper.currentBlogDB()
    const blogToBeUpdated = initDB[0]

    const updates = {
      author: 'updated author',
      title: 'updated title',
      likes: blogToBeUpdated.likes + 10
    }

    await api
      .put(`/api/blogs/${blogToBeUpdated.id}`)
      .send(updates)
      .expect(400)

    const updated = await api.get(`/api/blogs/${blogToBeUpdated.id}`)

    const newDB = await helper.currentBlogDB()
    expect(newDB.length).toBe(initDB.length)
    expect(updated.body).toEqual(blogToBeUpdated)
  })

  test('update by id without likes field succeeds', async () => {
    const initDB = await helper.currentBlogDB()
    const blogToBeUpdated = initDB[0]

    const updates = {
      author: 'updated author',
      title: 'updated title',
      url: 'updated url'
    }

    const newValues = await api
      .put(`/api/blogs/${blogToBeUpdated.id}`)
      .send(updates)
      .expect(200)

    const updated = await api.get(`/api/blogs/${blogToBeUpdated.id}`)

    const newDB = await helper.currentBlogDB()
    expect(newDB.length).toBe(initDB.length)
    expect(newValues.body).toEqual(updated.body)
  })

})

afterAll(async () => {
  await mongoose.connection.close()
})
