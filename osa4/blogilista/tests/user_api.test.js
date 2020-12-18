const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../App')
const User = require('../models/user')
const helper = require('./test_helper')
const api = supertest(app)

describe('GET & POST users', () => {
  beforeEach(async () => {
    await User.deleteMany({})
    await api
      .post('/api/users')
      .send(helper.initialUsers[0])
    await api
      .post('/api/users')
      .send(helper.initialUsers[1])
  })

  test('get all users returns json', async () => {
    await api
      .get('/api/users')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('get all returns all users', async () => {
    const allUsers = await api.get('/api/users').expect(200)

    expect(allUsers.body).toHaveLength(helper.initialUsers.length)
  })

  test('saving user with complete information succeeds', async () => {

    const user = {
      'username': 'elonene',
      'name': 'Eeva Elonen',
      'passwordHash': 'MelkeinSalainen'
    }

    await api
      .post('/api/users')
      .send(user)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const currentDB = await helper.currentUserDB()
    const userNames = currentDB.map(user => user.username)

    expect(currentDB).toHaveLength(helper.initialUsers.length + 1)
    expect(userNames).toContain(user.username)
  })

  test('saving user without username fails', async () => {

    const user = {
      'name': 'Onni Okkonen',
      'passwordHash': 'MelkeinSalainen'
    }

    await api
      .post('/api/users')
      .send(user)
      .expect(400)

    const currentDB = await helper.currentUserDB()
    const names = currentDB.map(user => user.name)

    expect(currentDB).toHaveLength(helper.initialUsers.length)
    expect(names).not.toContain(user.name)
  })

  test('saving user without name fails', async () => {

    const user = {
      'username': 'okkoneno',
      'passwordHash': 'MelkeinSalainen'
    }

    await api
      .post('/api/users')
      .send(user)
      .expect(400)

    const currentDB = await helper.currentUserDB()
    const userNames = currentDB.map(user => user.username)

    expect(currentDB).toHaveLength(helper.initialUsers.length)
    expect(userNames).not.toContain(user.username)
  })

  test('saving user without password fails', async () => {

    const user = {
      'username': 'okkoneno',
      'name': 'Onni Okkonen'
    }

    await api
      .post('/api/users')
      .send(user)
      .expect(500)

    const currentDB = await helper.currentUserDB()
    const userNames = currentDB.map(user => user.username)

    expect(currentDB).toHaveLength(helper.initialUsers.length)
    expect(userNames).not.toContain(user.username)
  })
})


afterAll(async () => {
  await mongoose.connection.close()
})
