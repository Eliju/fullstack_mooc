const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../App')

const api = supertest(app)

describe('login tests', () => {
  test('login with valid credentials succeeds', async () => {
    const li = {
      username: 'alainene',
      password: 'JokseenkinSalainen'
    }

    await api
      .post('/api/login')
      .send(li)
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('login without any credentials fails', async () => {
    const li = {
    }

    await api
      .post('/api/login')
      .send(li)
      .expect(401)
      .expect('Content-Type', /application\/json/)
  })

  test('login without pw fails', async () => {
    const li = {
      username: 'alainene',
    }

    await api
      .post('/api/login')
      .send(li)
      .expect(401)
      .expect('Content-Type', /application\/json/)
  })

  test('login without username fails', async () => {
    const li = {
      password: 'JokseenkinSalainen'
    }

    await api
      .post('/api/login')
      .send(li)
      .expect(401)
      .expect('Content-Type', /application\/json/)
  })

  test('login with wrong username fails', async () => {
    const li = {
      username: 'alainen',
      password: 'JokseenkinSalainen'
    }

    await api
      .post('/api/login')
      .send(li)
      .expect(401)
      .expect('Content-Type', /application\/json/)
  })

  test('login with wrong pw fails', async () => {
    const li = {
      username: 'alainene',
      password: 'Salainen'
    }

    await api
      .post('/api/login')
      .send(li)
      .expect(401)
      .expect('Content-Type', /application\/json/)
  })

  test('login with wrong username and pw fails', async () => {
    const li = {
      username: 'alainen',
      password: 'Salainen'
    }

    await api
      .post('/api/login')
      .send(li)
      .expect(401)
      .expect('Content-Type', /application\/json/)
  })
})


afterAll(async () => {
  await mongoose.connection.close()
})
