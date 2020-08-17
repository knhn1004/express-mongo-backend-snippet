const express = require('express')
const dotenv = require('dotenv')
const rateLimit = require('express-rate-limit')
const morgan = require('morgan')


const errorHandler = require('./middlewares/errorHandler')
const ErrorResponse = require('./utils/errorResponse')
const connectDB = require('./config/db')

// load env vars
dotenv.config({ path: './config/config.env' })


// connect to database
connectDB()

const app = express()

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'))
}

// init middleware
app.use(express.json({extended: false}))


// error response example
// app.get('/', (req, res, next) => {
  // return next(new ErrorResponse('this is a test error', 400))
  // try-catch(e) { return next(e) }
  // res.status(200).json({ success: true })
// })

// mount routes
app.use('/api/v1/users', require('./routes/user.route'))
app.use('/api/v1/auth', require('./routes/auth.route'))

// error handler to send json (must be put after the routes)
app.use(errorHandler)

const PORT = process.env.PORT || 3000

const server = app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
})

// handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`Unhandled Rejection: ${err.message}`)
  // close server & exit process
  server.close(() => process.exit(1))
})
