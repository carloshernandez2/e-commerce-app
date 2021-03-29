const express = require('express')
const expressAsyncHandler = require('express-async-handler')
const Order = require('../models/orderModel.js')
const { isAuth, isAdmin } = require('../utils.js')

const router = express.Router()

router.get(
  '/',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const orders = await Order.find({}).populate('user', 'name')
    res.send(orders)
  })
)

router.get(
  '/mine',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const orders = await Order.find({ user: req.user._id })
    res.send(orders)
  })
)

router.post(
  '/',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const newOrder = req.body.container
    if (newOrder.orderItems.length === 0) {
      res.status(400).send({ message: 'Cart is empty' })
    } else {
      const order = new Order({
        orderItems: newOrder.orderItems,
        shippingAddress: newOrder.shippingAddress,
        paymentMethod: newOrder.paymentMethod,
        itemsPrice: newOrder.itemsPrice,
        shippingPrice: newOrder.shippingPrice,
        taxPrice: newOrder.taxPrice,
        totalPrice: newOrder.totalPrice,
        user: req.user._id
      })
      const createdOrder = await order.save()
      res
        .status(201)
        .send({ message: 'New Order Created', order: createdOrder })
    }
  })
)

router.get(
  '/:id',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id)
    if ((order && (`${req.user._id}` === `${order.user}`)) || req.user.isAdmin) {
      res.send(order)
    } else {
      res.status(404).send({ message: 'Order Not Found' })
    }
  })
)

router.put(
  '/:id/pay',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    try {
      const order = await Order.findById(req.params.id)
      const paymentResult = req.body.container
      if (order) {
        order.isPaid = true
        order.paidAt = Date.now()
        order.paymentResult = {
          id: paymentResult.id,
          status: paymentResult.status,
          update_time: paymentResult.update_time,
          email_address: paymentResult.payer.email_address
        }
        const updatedOrder = await order.save()
        res.send(updatedOrder)
      } else {
        res.status(404).send({ message: 'Order Not Found', method: 'PUT' })
      }
    } catch (e) {
      res.status(404).send({ message: e.message, method: 'PUT' })
    }
  })
)

router.delete(
  '/:id',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id)
    if (order) {
      const deleteOrder = await order.remove()
      res.send(deleteOrder)
    } else {
      res.status(404).send({ message: 'Order Not Found' })
    }
  })
)

router.put(
  '/:id/deliver',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id)
    if (order) {
      order.isDelivered = true
      order.deliveredAt = Date.now()
      const updatedOrder = await order.save()
      res.send(updatedOrder)
    } else {
      res.status(404).send({ message: 'Order Not Found' })
    }
  })
)

module.exports = router
