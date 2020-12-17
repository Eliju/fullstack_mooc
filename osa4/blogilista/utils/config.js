require('dotenv').config()

const un = process.env['MONGODB_USER']
const pw = process.env['MONGODB_USER_PW']
let DB = process.env['MONGODB_DATABASE']
let MONGODB_URL = process.env['MONGODB_CONN_STRING']
MONGODB_URL = MONGODB_URL.replace('${un}',un).replace('${pw}', pw).replace('${db}',DB)
let PORT = process.env['PORT']

if (process.env.NODE_ENV === 'test') {
  MONGODB_URL=process.env.TEST_MONGODB_URI
}

module.exports = {
  MONGODB_URL,
  PORT,
  DB
}