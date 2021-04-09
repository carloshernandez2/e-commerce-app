const express = require('express')
const path = require('path')
const cookieParser = require('cookie-parser')
const logger = require('morgan')
const mongoose = require('mongoose')
const productRouter = require('./routes/productRouter')
const userRouter = require('./routes/userRouter')
const orderRouter = require('./routes/orderRouter')
const uploadRouter = require('./routes/uploadRouter')
const dotenv = require('dotenv')
const cors = require('cors')
const errorhandler = require('errorhandler')

dotenv.config()

const app = express()

app.use(
  cors({
    origin:
      process.env.NODE_ENV === 'production'
        ? process.env.LOCALHOST
        : ['http://localhost:3000', 'http://localhost:5000'], // <-- location of the react app were connecting to
    credentials: true
  })
)
app.use(logger('dev'))
app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({ extended: true, limit: '50mb' }))
app.use(cookieParser())

mongoose.connect(
  process.env.MONGODB_URL || 'mongodb://localhost/postres_de_la_abuela',
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
  }
)

// app.use(express.static(path.join(__dirname, 'client/build')))
if (process.env.NODE_ENV === 'production') {
  // only use in production
  app.use(express.static(path.join(__dirname, 'client/build')))
}

app.use('/api/uploads', uploadRouter)
app.use('/api/products', productRouter)
app.use('/api/users', userRouter)
app.use('/api/orders', orderRouter)
app.get('/api/config/paypal', (req, res) => {
  res.send(process.env.PAYPAL_CLIENT_ID || 'sb')
})

app.use('/uploads', express.static(path.join(__dirname, '/uploads')))

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/build/index.html'))
})

app.use(errorhandler())

module.exports = app
