const asyncHandler = require('../middlewares/async')
const ErrorResponse = require('../utils/errorResponse')
const User = require('../models/User')
const jwt = require('jsonwebtoken')

// 登入
exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body
  if (!email || !password) {
    return next(new ErrorResponse('must provide email and password'), 400)
  }
  // because we hide our password, here we must specify 'select'
  const user = await User.findOne({ email }).select('password')
  if (!user) {
    return next(new ErrorResponse('您輸入的資料有誤', 400))
  }

  try {
    await user.comparePassword(password)
  } catch (e) {
    return next(new ErrorResponse('您輸入的資料有誤', 400))
  }

  const payload = {
    user: {
      id: user.id,
    },
  }
  jwt.sign(
    payload,
    process.env.JWT_SECRET,
    { expiresIn: 3600 },
    (err, token) => {
      if (err) return next(new ErrorResponse('伺服器錯誤，請稍後再試', 500))
      res.status(200).json({ token })
    }
  )
})
