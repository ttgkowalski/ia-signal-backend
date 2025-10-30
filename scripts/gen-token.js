const jwt = require('jsonwebtoken')

const secret = 'i-am-an-idiot'
const payload = {
  sub: 'test-user',
  role: 'User',
  ssid: 'd613e4a3e44333b67eaecbcbfdd3041t',
}

const token = jwt.sign(payload, secret, { algorithm: 'HS256' })
console.log(token)


