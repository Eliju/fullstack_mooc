const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../App')
const Blog = require('../models/blog')
const User = require('../models/user')
const helper = require('./test_helper')
const jwt = require('jsonwebtoken')

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
  let token = ''
  beforeAll(async () => {
    await Blog.deleteMany({})
    await User.deleteMany({})
    await api
      .post('/api/users')
      .send(helper.initialUsers[0])
    await api
      .post('/api/users')
      .send(helper.initialUsers[1])

    const username = 'alainene'
    const user = await User.findOne({ username: username })
    const userForToken = {
      username: username,
      id: user.id
    }
    token = jwt.sign(userForToken, process.env.SECRET_VALUE)
  })


  test('blog is added when auth token is given', async() => {
    const initialDB = await helper.currentBlogDB()
    const newBlog = {
      author: 'BearFi73',
      title: 'Motoristinallen matkakertomuksia',
      url: 'https://ranneliike.net/blogit/motoristinallen-matkakertomuksia',
      likes: 34
    }

    await api
      .post('/api/blogs')
      .set('authorization', `bearer ${token}`)
      .send(newBlog)
      .expect(200)  //Status === OK
      .expect('Content-Type',/application\/json/)

    const res = await helper.currentBlogDB()
    const blogTitles = res.map(b => b.title)

    expect(res).toHaveLength(initialDB.length + 1)
    expect(blogTitles).toContain(newBlog.title)
  })

  test('blog addition with invalid auth token fails', async() => {
    const initialDB = await helper.currentBlogDB()
    const newBlog = {
      author: 'BearFi73',
      title: 'Motoristinallen matkakertomuksia, osa 2',
      url: 'https://ranneliike.net/blogit/motoristinallen-matkakertomuksia-osa2',
      likes: 34
    }

    await api
      .post('/api/blogs')
      .set('authorization', 'bearer JhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiYWxhaW5lbmUiLCJpZCI6IjVmZGU1OTIxMTllMjNjNGI3ODRjZTZlYyIsImlhdCI6MTYwODQwOTA5M30.cEwXCSul3zODWyXtuc1UE46VTUhh7tIGAAc8WuIe-Xs')
      .send(newBlog)
      .expect(401)
      .expect('Content-Type',/application\/json/)

    const res = await helper.currentBlogDB()
    const blogTitles = res.map(b => b.title)

    expect(res).toHaveLength(initialDB.length)
    expect(blogTitles).not.toContain(newBlog.title)
  })

  test('blog addition without auth token fails', async() => {
    const initialDB = await helper.currentBlogDB()
    const newBlog = {
      author: 'BearFi73',
      title: 'Motoristinallen matkakertomuksia, osa 3',
      url: 'https://ranneliike.net/blogit/motoristinallen-matkakertomuksia-osa3',
      likes: 34
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(401)
      .expect('Content-Type',/application\/json/)

    const res = await helper.currentBlogDB()
    const blogTitles = res.map(b => b.title)

    expect(res).toHaveLength(initialDB.length)
    expect(blogTitles).not.toContain(newBlog.title)
  })

  /* test('blog without author is not added', async () => {
    const newBlog = {
      title: 'Motoristinallen matkakertomuksia, osa 4',
      url: 'https://ranneliike.net/blogit/motoristinallen-matkakertomuksia-osa4',
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
  test('blog without title is not added (auth token given)', async () => {
    const initialDB = await helper.currentBlogDB()
    const newBlog = {
      author: 'BearFi73',
      url: 'https://ranneliike.net/blogit/motoristinallen-matkakertomuksia-osa5',
      likes: 34
    }

    await api
      .post('/api/blogs')
      .set('authorization', `bearer ${token}`)
      .send(newBlog)
      .expect({ error: 'Blog validation failed: title: Path `title` is required.' })
      .expect(400) // Status = Bad Request

    const res = await helper.currentBlogDB()
    const blogURLs = res.map(b => b.url)

    expect(res).toHaveLength(initialDB.length)
    expect(blogURLs).not.toContain(newBlog.url)
  })

  test('blog without url is not added (auth token given)', async () => {
    const initialDB = await helper.currentBlogDB()
    const newBlog = {
      author: 'BearFi73',
      title: 'Motoristinallen matkakertomuksia, osa 6',
      likes: 34
    }

    await api
      .post('/api/blogs')
      .set('authorization', `bearer ${token}`)
      .send(newBlog)
      .expect({ error: 'Blog validation failed: url: Path `url` is required.' })
      .expect(400) // Status = Bad Request

    const res = await helper.currentBlogDB()
    const blogTitles = res.map(b => b.title)

    expect(res).toHaveLength(initialDB.length)
    expect(blogTitles).not.toContain(newBlog.title)
  })

  test('blog without like is added with 0 likes (auth token given)', async () => {
    const initialDB = await helper.currentBlogDB()
    const newBlog = {
      author: 'BearFi73',
      title: 'Motoristinallen matkakertomuksia, osa 7',
      url: 'https://ranneliike.net/blogit/motoristinallen-matkakertomuksia-osa7'
    }

    await api
      .post('/api/blogs')
      .set('authorization', `bearer ${token}`)
      .send(newBlog)
      .expect(200)  //Status === OK
      .expect('Content-Type',/application\/json/)

    const blogs = await helper.currentBlogDB()

    expect(blogs).toHaveLength(initialDB.length + 1)
    const added = blogs.filter(b => ((b.author === newBlog.author) && (b.title === newBlog.title) && (b.url === newBlog.url)))
    expect(added.length).toBe(1)
    expect(added[0].likes).toBe(0)
  })
})

describe('Blog deletion', () => {
  let token = ''
  beforeAll(async () => {
    await Blog.deleteMany({})
    await User.deleteMany({})
    await api
      .post('/api/users')
      .send(helper.initialUsers[0])
    await api
      .post('/api/users')
      .send(helper.initialUsers[1])

    const username = 'alainene'
    const user = await User.findOne({ username: username })
    const userForToken = {
      username: username,
      id: user.id
    }
    token = jwt.sign(userForToken, process.env.SECRET_VALUE)
    await api
      .post('/api/blogs')
      .set('authorization', `bearer ${token}`)
      .send(helper.initialBlogs[0])
    await api
      .post('/api/blogs')
      .set('authorization', `bearer ${token}`)
      .send(helper.initialBlogs[1])

  })

  //the two added blogs are in the db
  test('there are two blogs saved', async () => {
    const response = await api.get('/api/blogs')
    expect(response.body).toHaveLength(helper.initialBlogs.length)
  })

  test('blog deletion by id fails without valid token', async () => {
    const initDB = await helper.currentBlogDB()
    const blogToBeDeleted = initDB[0]

    await api
      .delete(`/api/blogs/${blogToBeDeleted.id}`)
      .expect(401)

    const blogsLeft = await helper.currentBlogDB()
    const found = blogsLeft.filter(b => (b.id === blogToBeDeleted.id))
    expect(blogsLeft).toHaveLength(initDB.length)
    expect(found).toHaveLength(1)
  })

  test('blog deletion by id fails with invalid token', async () => {
    const initDB = await helper.currentBlogDB()
    const blogToBeDeleted = initDB[0]

    await api
      .delete(`/api/blogs/${blogToBeDeleted.id}`)
      .set('authorization', 'bearer JhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiYWxhaW5lbmUiLCJpZCI6IjVmZGU1OTIxMTllMjNjNGI3ODRjZTZlYyIsImlhdCI6MTYwODQwOTA5M30.cEwXCSul3zODWyXtuc1UE46VTUhh7tIGAAc8WuIe-Xs')
      .expect(401)

    const blogsLeft = await helper.currentBlogDB()
    const found = blogsLeft.filter(b => (b.id === blogToBeDeleted.id))
    expect(blogsLeft).toHaveLength(initDB.length)
    expect(found).toHaveLength(1)
  })

  test('blog deletion by id succeeds with valid token', async () => {
    const initDB = await helper.currentBlogDB()
    const blogToBeDeleted = initDB[0]

    await api
      .delete(`/api/blogs/${blogToBeDeleted.id}`)
      .set('authorization', `bearer ${token}`)
      .expect(200)

    const blogsLeft = await helper.currentBlogDB()
    const found = blogsLeft.filter(b => (b.id === blogToBeDeleted.id))
    expect(blogsLeft).toHaveLength(initDB.length -1)
    expect(found).toHaveLength(0)
  })

  test('deletion with non-existent id returns error (token added)', async () => {
    const initDB = await helper.currentBlogDB()
    const blogToBeDeleted = helper.nonExistentID()

    await api
      .delete(`/api/blogs/${blogToBeDeleted.id}`)
      .set('authorization', `bearer ${token}`)
      .expect(400)

    const blogsLeft = await helper.currentBlogDB()
    const found = blogsLeft.filter(b => (b.id === blogToBeDeleted.id))
    expect(blogsLeft).toHaveLength(initDB.length)
    expect(found).toHaveLength(0)
  })

  test('deletion with non-valid id format returns error (token added)', async () => {
    const initDB = await helper.currentBlogDB()
    const blogToBeDeleted = '1234asdf'

    await api
      .delete(`/api/blogs/${blogToBeDeleted.id}`)
      .set('authorization', `bearer ${token}`)
      .expect(400)

    const blogsLeft = await helper.currentBlogDB()
    const found = blogsLeft.filter(b => (b.id === blogToBeDeleted.id))
    expect(blogsLeft).toHaveLength(initDB.length)
    expect(found).toHaveLength(0)
  })
})

describe('Blog update', () => {
  let token = ''
  beforeAll(async () => {
    await Blog.deleteMany({})
    await User.deleteMany({})
    await api
      .post('/api/users')
      .send(helper.initialUsers[0])
    await api
      .post('/api/users')
      .send(helper.initialUsers[1])

    const username = 'alainene'
    const user = await User.findOne({ username: username })
    const userForToken = {
      username: username,
      id: user.id
    }
    token = jwt.sign(userForToken, process.env.SECRET_VALUE)
    await api
      .post('/api/blogs')
      .set('authorization', `bearer ${token}`)
      .send(helper.initialBlogs[0])
    await api
      .post('/api/blogs')
      .set('authorization', `bearer ${token}`)
      .send(helper.initialBlogs[1])

  })

  //the two added blogs are in the db
  test('there are two blogs saved', async () => {
    const response = await api.get('/api/blogs')
    expect(response.body).toHaveLength(helper.initialBlogs.length)
  })

  test('update by id with all fields updated fails without valid token', async () => {
    const initDB = await helper.currentBlogDB()
    const blogToBeUpdated = initDB[0]

    const updates = {
      author: 'updated author 1',
      title: 'updated title 1',
      url: 'updated url 1',
      likes: blogToBeUpdated.likes + 10
    }

    await api
      .put(`/api/blogs/${blogToBeUpdated.id}`)
      .send(updates)
      .expect(401)

    const newDB = await helper.currentBlogDB()
    expect(newDB.length).toBe(initDB.length)
  })

  test('update by id with all fields updated fails with invalid token', async () => {
    const initDB = await helper.currentBlogDB()
    const blogToBeUpdated = initDB[0]

    const updates = {
      author: 'updated author 2',
      title: 'updated title 2',
      url: 'updated url 2',
      likes: blogToBeUpdated.likes + 10
    }

    await api
      .put(`/api/blogs/${blogToBeUpdated.id}`)
      .set('authorization', 'bearer JhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiYWxhaW5lbmUiLCJpZCI6IjVmZGU1OTIxMTllMjNjNGI3ODRjZTZlYyIsImlhdCI6MTYwODQwOTA5M30.cEwXCSul3zODWyXtuc1UE46VTUhh7tIGAAc8WuIe-Xs')
      .send(updates)
      .expect(401)

    const newDB = await helper.currentBlogDB()
    expect(newDB.length).toBe(initDB.length)
  })

  test('update by id with all fields updated succeeds with valid token', async () => {
    const initDB = await helper.currentBlogDB()
    const blogToBeUpdated = initDB[0]

    const updates = {
      author: 'updated author 3',
      title: 'updated title 3',
      url: 'updated url 3',
      likes: blogToBeUpdated.likes + 10
    }

    const newValues = await api
      .put(`/api/blogs/${blogToBeUpdated.id}`)
      .set('authorization', `bearer ${token}`)
      .send(updates)
      .expect(200)

    const updated = await api.get(`/api/blogs/${blogToBeUpdated.id}`)

    const newDB = await helper.currentBlogDB()
    expect(newDB.length).toBe(initDB.length)
    expect(updated.body.author).toEqual(updates.author)
    expect(updated.body.title).toEqual(updates.title)
    expect(updated.body.url).toEqual(updates.url)
    expect(updated.body.likes).toEqual(updates.likes)
    expect(newValues.body).toEqual(updated.body)
  })

  test('update by id without author field succeeds (token given)', async () => {
    const initDB = await helper.currentBlogDB()
    const blogToBeUpdated = initDB[0]

    const updates = {
      title: 'updated title 4',
      url: 'updated url 4',
      likes: blogToBeUpdated.likes + 10
    }

    const newValues = await api
      .put(`/api/blogs/${blogToBeUpdated.id}`)
      .set('authorization', `bearer ${token}`)
      .send(updates)
      .expect(200)

    const updated = await api.get(`/api/blogs/${blogToBeUpdated.id}`)

    const newDB = await helper.currentBlogDB()
    expect(newDB.length).toBe(initDB.length)
    expect(updated.body.author).toEqual(blogToBeUpdated.author)
    expect(updated.body.title).toEqual(updates.title)
    expect(updated.body.url).toEqual(updates.url)
    expect(updated.body.likes).toEqual(updates.likes)
    expect(newValues.body).toEqual(updated.body)
  })

  test('update by id without title field keeps the original title (token given)', async () => {
    const initDB = await helper.currentBlogDB()
    const blogToBeUpdated = initDB[0]

    const updates = {
      author: 'updated author 5',
      url: 'updated url 5',
      likes: blogToBeUpdated.likes + 10
    }

    const newValues = await api
      .put(`/api/blogs/${blogToBeUpdated.id}`)
      .set('authorization', `bearer ${token}`)
      .send(updates)
      .expect(200)

    const updated = await api.get(`/api/blogs/${blogToBeUpdated.id}`)

    const newDB = await helper.currentBlogDB()
    expect(newDB.length).toBe(initDB.length)
    expect(updated.body.author).toEqual(updates.author)
    expect(updated.body.title).toEqual(blogToBeUpdated.title)
    expect(updated.body.url).toEqual(updates.url)
    expect(updated.body.likes).toEqual(updates.likes)
    expect(newValues.body).toEqual(updated.body)
  })

  test('update by id without url field keeps the original url (token given)', async () => {
    const initDB = await helper.currentBlogDB()
    const blogToBeUpdated = initDB[0]

    const updates = {
      author: 'updated author 6',
      title: 'updated title 6',
      likes: blogToBeUpdated.likes + 10
    }

    const newValues = await api
      .put(`/api/blogs/${blogToBeUpdated.id}`)
      .set('authorization', `bearer ${token}`)
      .send(updates)
      .expect(200)

    const updated = await api.get(`/api/blogs/${blogToBeUpdated.id}`)

    const newDB = await helper.currentBlogDB()
    expect(newDB.length).toBe(initDB.length)
    expect(updated.body.author).toEqual(updates.author)
    expect(updated.body.title).toEqual(updates.title)
    expect(updated.body.url).toEqual(blogToBeUpdated.url)
    expect(updated.body.likes).toEqual(updates.likes)
    expect(newValues.body).toEqual(updated.body)
  })

  test('update by id without likes field succeeds (token given)', async () => {
    const initDB = await helper.currentBlogDB()
    const blogToBeUpdated = initDB[0]

    const updates = {
      author: 'updated author 7',
      title: 'updated title 7',
      url: 'updated url 7'
    }

    const newValues = await api
      .put(`/api/blogs/${blogToBeUpdated.id}`)
      .set('authorization', `bearer ${token}`)
      .send(updates)
      .expect(200)

    const updated = await api.get(`/api/blogs/${blogToBeUpdated.id}`)

    const newDB = await helper.currentBlogDB()
    expect(newDB.length).toBe(initDB.length)
    expect(updated.body.author).toEqual(updates.author)
    expect(updated.body.title).toEqual(updates.title)
    expect(updated.body.url).toEqual(updates.url)
    expect(updated.body.likes).toEqual(blogToBeUpdated.likes)
    expect(newValues.body).toEqual(updated.body)
  })

})

afterAll(async () => {
  await mongoose.connection.close()
})
