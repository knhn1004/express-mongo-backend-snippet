const jwt = require('jsonwebtoken')

const asyncHandler = require('../middlewares/async')
const User = require('../models/User')
const ErrorResponse = require('../utils/errorResponse')

// @desc   註冊帳號
// @route  POST /api/v1/users
// @access Public
exports.signup = asyncHandler(async (req, res, next) => {
  // return next(new ErrorResponse('test error'), 400)
  const { name, email, password } = req.body
  let user = await User.findOne({ email })
  if (user) {
    return next(new ErrorResponse('此email已有人使用', 400))
  }
  user = new User({ name, email, password })
  await user.save()

  // json web token
  const payload = {
    user: {
      id: user.id,
    },
  }
  // TODO: set expires to 3600 (1hr)
  jwt.sign(
    payload,
    process.env.JWT_SECRET,
    { expiresIn: 3600 },
    (err, token) => {
      if (err) throw err
      res.status(201).json({ token })
    }
  )
})

// @desc   Get all users
// @route  GET /api/v1/users
// @access Private (TODO: private)
exports.getUsers = (req, res, next) => {
  res.status(200).json({ success: true, msg: 'Show all users' })
}

// @desc   Get single user
// @route  GET /api/v1/users/:id
// @access Private (TODO: private)
exports.getSingleUser = (req, res, next) => {
  res.status(200).json({ success: true, msg: 'Get single user' })
}
