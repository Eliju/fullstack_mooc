const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.get('/', async (request, response) => {
  const users = await User.find({})
  response.json(users.map(user => user.toJSON()))
})

usersRouter.post('/', async (request, response) => {
  const body = request.body
  const password = body.passwordHash

  const saltRounds = 10
  const salt = await bcrypt.genSaltSync(saltRounds)
  const hashSekret = await bcrypt.hashSync(password, salt)

  const user = new User({
    username: body.username,
    name: body.name,
    passwordHash: hashSekret
  })

  const savedUser = await user.save()

  response.json(savedUser)

})

module.exports = usersRouter