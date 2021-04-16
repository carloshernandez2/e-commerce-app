const express = require('express')
const expressAsyncHandler = require('express-async-handler')
const Order = require('../models/orderModel.js')
const {
  isAuth,
  isSellerOrAdmin,
  isAdmin,
  mailgun,
  payOrderEmailTemplate
} = require('../middleware/utils.js')
const User = require('../models/userModel.js')
const Product = require('../models/productModel.js')
const { findSellers, isOrderSeller } = require('../middleware/helperMethods')

const router = express.Router()

router.get(
  '/',
  isAuth,
  isSellerOrAdmin,
  expressAsyncHandler(async (req, res) => {
    const seller = req.query.seller || ''
    const sellerFilter = seller ? { 'sellers.seller': seller } : {}
    const orders = await Order.find({ ...sellerFilter }).populate(
      'user',
      'name'
    )
    res.send(orders)
  })
)

router.get(
  '/summary',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const orders = await Order.aggregate([
      {
        $group: {
          _id: null,
          numOrders: { $sum: 1 },
          totalSales: { $sum: '$totalPrice' }
        }
      }
    ])
    const users = await User.aggregate([
      {
        $group: {
          _id: null,
          numUsers: { $sum: 1 }
        }
      }
    ])
    const dailyOrders = await Order.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          orders: { $sum: 1 },
          sales: { $sum: '$totalPrice' }
        }
      },
      { $sort: { _id: 1 } }
    ])
    const productCategories = await Product.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 }
        }
      }
    ])
    res.send({ users, orders, dailyOrders, productCategories })
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
    const sellers = findSellers(newOrder.orderItems)
    if (newOrder.orderItems.length === 0) {
      res.status(400).send({ message: 'Cart is empty' })
    } else {
      const order = new Order({
        sellers,
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
    const userId = req.user._id
    const seller = isOrderSeller(order, userId)
    if (
      (order && `${req.user._id}` === `${order.user}`) ||
      req.user.isAdmin ||
      seller
    ) {
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
        .populate('user', 'email name')
        .populate('sellers.seller', 'email name')
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
        const seller = order.sellers[0].seller
        mailgun()
          .messages()
          .send(
            {
              from: 'Postres de la abuela <postmaster@heiotti.tech>',
              to: `${order.user.name} <${order.user.email}>`,
              cc: `${seller.email}`,
              subject: `Nuevo pedido ${order._id}`,
              html: payOrderEmailTemplate(order)
            },
            (error, body) => {
              if (error) {
                console.log(error)
              } else {
                console.log(body)
              }
            }
          )
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
  isSellerOrAdmin,
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
