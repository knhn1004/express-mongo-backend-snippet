const express = require('express')
const {
  getUsers,
  getSingleUser,
  signup,
} = require('../controllers/user.controller')
const { validateUser } = require('../middlewares/validators/userValidator')
const { auth, authAdmin } = require('../middlewares/auth')

const router = express.Router()

router.route('/').get(auth, authAdmin, getUsers).post(validateUser, signup)

router.route('/:id').get(getSingleUser)

module.exports = router
