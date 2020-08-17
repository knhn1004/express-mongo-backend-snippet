const jwt = require('jsonwebtoken')
const ErrorResponse = require('../utils/errorResponse')
const User = require('../models/User')

// 已登入
const auth = (req, res, next) => {
  const authHeader = req.headers.authorization
  if (!authHeader)
    return next(new ErrorResponse('no token, authorization denied', 401))

  // for Bearer token
  const token = authHeader.split(' ')[1]
  jwt.verify(token, process.env.JWT_SECRET, async (err, result) => {
    if (err) {
      return next(new ErrorResponse('invalid token', 403))
    }
    const user = await User.findOne({ _id: result.user.id })
    req.user = user
    next()
  })
}

// 為admin帳號
const authAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next()
  } else {
    return next(new ErrorResponse('operaiton denied', 403))
  }
}

module.exports = { auth, authAdmin }
