const data = require('../data.js')
const expressAsyncHandler = require('express-async-handler')
const User = require('../models/userModel.js')
const { generateToken, isAuth, isAdmin } = require('../utils.js')
const bcrypt = require('bcryptjs')

const express = require('express')
const router = express.Router()

router.get('/seed', expressAsyncHandler(async (req, res) => {
  // await User.remove({});
  const createdUsers = await User.insertMany(data.users)
  res.send({ createdUsers })
})
)

router.post(
  '/signin',
  expressAsyncHandler(async (req, res) => {
    const user = await User.findOne({ email: req.body.email })
    if (user) {
      if (bcrypt.compareSync(req.body.password, user.password)) {
        res.send({
          _id: user._id,
          name: user.name,
          email: user.email,
          isAdmin: user.isAdmin,
          token: generateToken(user)
        })
        return
      }
    }
    res.status(401).send({ message: 'Invalid email or password' })
  })
)

router.post(
  '/register',
  expressAsyncHandler(async (req, res) => {
    const user = new User({
      name: req.body.name,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password, 8)
    })
    try {
      const createdUser = await user.save()
      res.send({
        _id: createdUser._id,
        name: createdUser.name,
        email: createdUser.email,
        isAdmin: createdUser.isAdmin,
        token: generateToken(createdUser)
      })
    } catch (e) {
      if (e.name === 'MongoError' && e.code === 11000) {
        e.message = 'email already registered'
      }
      res.status(401).send({ message: e.message })
    }
  })
)

router.get(
  '/:id',
  expressAsyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id)
    if (user) {
      res.send(user)
    } else {
      res.status(404).send({ message: 'User Not Found' })
    }
  })
)

router.put(
  '/profile',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id)
    if (user) {
      user.name = req.body.name || user.name
      user.email = req.body.email || user.email
      if (req.body.password) {
        user.password = bcrypt.hashSync(req.body.password, 8)
      }
      const updatedUser = await user.save()
      res.send({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        isAdmin: updatedUser.isAdmin,
        token: generateToken(updatedUser)
      })
    }
  })
)

router.get(
  '/',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const users = await User.find({})
    if (users) {
      res.send(users)
    } else {
      res.status(404).send({ message: 'No se encontró ningún usuario' })
    }
  })
)

router.delete(
  '/:id',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id)
    if (user) {
      if (user.isAdmin) {
        res.status(400).send({ message: 'No puedes borrar un administrador' })
        return
      }
      const deleteUser = await user.remove()
      res.send({ message: 'User Deleted', user: deleteUser })
    } else {
      res.status(404).send({ message: 'User Not Found' })
    }
  })
)

router.put(
  '/:id',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id)
    if (user) {
      user.name = req.body.name || user.name
      user.email = req.body.email || user.email
      user.isSeller = req.body.isSeller || user.isSeller
      user.isAdmin = req.body.isAdmin || user.isAdmin
      const updatedUser = await user.save()
      res.send({ message: 'User Updated', user: updatedUser })
    } else {
      res.status(404).send({ message: 'User Not Found' })
    }
  })
)

module.exports = router
