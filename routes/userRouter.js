const data = require('../data.js')
const expressAsyncHandler = require('express-async-handler')
const User = require('../models/userModel.js')
const { generateToken, isAuth, isAdmin } = require('../middleware/utils.js')
const bcrypt = require('bcryptjs')

const express = require('express')
const router = express.Router()

router.get(
  '/top-sellers',
  expressAsyncHandler(async (req, res) => {
    const topSellers = await User.find({ isSeller: true })
      .sort({ 'seller.rating': -1 })
      .limit(3)
    res.send(topSellers)
  })
)

router.get(
  '/seed',
  expressAsyncHandler(async (req, res) => {
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
          isSeller: user.isSeller,
          seller: user.isSeller ? user.seller : undefined,
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
      createdUser.seller.logo = `/uploads/${createdUser._id}.jpg`
      const finalUser = await createdUser.save()
      res.send({
        _id: finalUser._id,
        name: finalUser.name,
        email: finalUser.email,
        isAdmin: finalUser.isAdmin,
        isSeller: finalUser.isSeller,
        token: generateToken(finalUser)
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
      res.send([user])
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
      if (user.isSeller) {
        user.seller.name = req.body.sellerName || user.seller.name
        user.seller.logo = req.body.sellerLogo || user.seller.logo
        user.seller.description =
          req.body.sellerDescription || user.seller.description
      }
      if (req.body.password) {
        user.password = bcrypt.hashSync(req.body.password, 8)
      }
      const updatedUser = await user.save()
      res.send({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        isAdmin: updatedUser.isAdmin,
        isSeller: user.isSeller,
        seller: user.isSeller ? user.seller : undefined,
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
      user.isSeller = req.body.isSeller
      user.isAdmin = req.body.isAdmin
      const updatedUser = await user.save()
      res.send(updatedUser)
    } else {
      res.status(404).send({ message: 'User Not Found' })
    }
  })
)

module.exports = router
