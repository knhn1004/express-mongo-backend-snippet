const { check, validationResult } = require('express-validator')
const ErrorResponse = require('../../utils/errorResponse')

exports.validateUser = [
  check('name', '請輸入 姓名').not().isEmpty(),
  check('email', '請輸入 email').not().isEmpty(),
  check('password', '請輸入至少6位元的密碼').isLength({ min: 6 }),
  (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      const message = errors.array().map(err => err.msg)
      return next(new ErrorResponse(message, 400))
    }
    next()
  },
]
