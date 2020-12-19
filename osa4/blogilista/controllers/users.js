const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')
const logger = require('../utils/logger')

usersRouter.get('/', async (request, response) => {
  const users = await User.find({}).populate('blogs',{ 'author': 1,'title': 1,'url': 1,'likes': 1 })
  response.json(users.map(user => user.toJSON()))
})

usersRouter.post('/', async (request, response) => {
  const body = request.body
  const password = body.passwordHash

  if (password && (password.length > 2)) {

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
  } else {
    let msg = ''
    if (password) {
      msg = 'Password needs to be at least 3 characters long'
    } else {
      msg = 'Password is a mandatory field'
    }
    logger.error(msg)
    response.status(400).json(msg)
  }
})

module.exports = usersRouter