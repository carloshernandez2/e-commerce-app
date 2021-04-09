const express = require('express')
const expressAsyncHandler = require('express-async-handler')
const data = require('../data.js')
const Product = require('../models/productModel.js')
const { isAuth, isSellerOrAdmin } = require('../middleware/utils.js')

const router = express.Router()

router.get(
  '/',
  expressAsyncHandler(async (req, res) => {
    try {
      const name = req.query.name || ''
      const category = req.query.category || ''
      const seller = req.query.seller || ''
      const nameFilter = name ? { name: { $regex: name, $options: 'i' } } : {}
      const sellerFilter = seller ? { seller } : {}
      const categoryFilter = category ? { category } : {}
      const products = await Product.find({
        ...sellerFilter,
        ...nameFilter,
        ...categoryFilter
      }).populate(
        'seller',
        'seller.name seller.logo seller.rating seller.numReviews'
      )
      res.send(products)
    } catch (e) {
      res.status(500).json({ error: e })
    }
  })
)

router.post(
  '/',
  isAuth,
  isSellerOrAdmin,
  expressAsyncHandler(async (req, res) => {
    const product = new Product({
      name: `sample-${Date.now()}`,
      seller: req.user._id,
      image: '/images/p1.jpg',
      price: 0,
      category: 'sample category',
      brand: 'sample brand',
      countInStock: 0,
      rating: 0,
      numReviews: 0,
      description: 'sample description'
    })
    try {
      const createdProduct = await product.save()
      if (createdProduct) {
        createdProduct.image = `/uploads/${createdProduct._id}.jpg`
        const finalProduct = await createdProduct.save()
        res.send(finalProduct)
      }
    } catch (e) {
      if (e.name === 'MongoError' && e.code === 11000) {
        e.message = 'name already registered'
      }
      res.status(500).send({ message: e.message })
    }
  })
)

router.get(
  '/categories',
  expressAsyncHandler(async (req, res) => {
    const categories = await Product.find().distinct('category')
    res.send(categories)
  })
)

router.put(
  '/:id',
  isAuth,
  isSellerOrAdmin,
  expressAsyncHandler(async (req, res) => {
    const productId = req.params.id
    const product = await Product.findById(productId)
    if (product) {
      product.name = req.body.name
      product.price = req.body.price
      product.category = req.body.category
      product.brand = req.body.brand
      product.countInStock = req.body.countInStock
      product.description = req.body.description
      const updatedProduct = await product.save()
      res.send(updatedProduct)
    } else {
      res.status(404).send({ message: 'Product Not Found' })
    }
  })
)

router.delete(
  '/:id',
  isAuth,
  isSellerOrAdmin,
  expressAsyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id)
    if (product) {
      const deleteProduct = await product.remove()
      res.send(deleteProduct)
    } else {
      res.status(404).send({ message: 'Product Not Found' })
    }
  })
)

router.get(
  '/seed',
  expressAsyncHandler(async (req, res) => {
    // await Product.remove({});
    try {
      const createdProducts = await Product.insertMany(data.products)
      res.send({ createdProducts })
    } catch (e) {
      res.json({ message: e.message })
    }
  })
)

module.exports = router
