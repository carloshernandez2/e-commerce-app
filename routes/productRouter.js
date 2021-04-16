const express = require('express')
const expressAsyncHandler = require('express-async-handler')
const data = require('../data.js')
const User = require('../models/userModel.js')
const Product = require('../models/productModel.js')
const { isAuth, isSellerOrAdmin } = require('../middleware/utils.js')

const router = express.Router()

router.get(
  '/',
  expressAsyncHandler(async (req, res) => {
    try {
      const pageSize = 3
      const page = Number(req.query.pageNumber) || 1
      const name = req.query.name || ''
      const category = req.query.category || ''
      const seller = req.query.seller || ''
      const order = req.query.order || ''
      const min =
        req.query.min && Number(req.query.min) !== 0
          ? Number(req.query.min)
          : 0
      const max =
        req.query.max && Number(req.query.max) !== 0
          ? Number(req.query.max)
          : 0
      const rating =
        req.query.rating && Number(req.query.rating) !== 0
          ? Number(req.query.rating)
          : 0
      const nameFilter = name ? { name: { $regex: name, $options: 'i' } } : {}
      const sellerFilter = seller ? { seller } : {}
      const categoryFilter = category ? { category } : {}
      const priceFilter = min && max ? { price: { $gte: min, $lte: max } } : {}
      const ratingFilter = rating ? { rating: { $gte: rating } } : {}
      const sortOrder =
        order === 'lowest'
          ? { price: 1 }
          : order === 'highest'
            ? { price: -1 }
            : order === 'toprated'
              ? { rating: -1 }
              : { _id: -1 }
      const count = await Product.count({
        ...sellerFilter,
        ...nameFilter,
        ...categoryFilter,
        ...priceFilter,
        ...ratingFilter
      })
      const products = await Product.find({
        ...sellerFilter,
        ...nameFilter,
        ...categoryFilter,
        ...priceFilter,
        ...ratingFilter
      })
        .populate(
          'seller',
          'seller.name seller.logo seller.rating seller.numReviews'
        )
        .sort(sortOrder)
        .skip(pageSize * (page - 1))
        .limit(pageSize)
      res.send({ products, page, pages: Math.ceil(count / pageSize) })
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
      const seller = await User.findOne({ isSeller: true })
      if (seller) {
        const products = data.products.map((product) => ({
          ...product,
          seller: seller._id
        }))
        const createdProducts = await Product.insertMany(products)
        res.send({ createdProducts })
      } else {
        res
          .status(500)
          .send({ message: 'No seller found. first run /api/users/seed' })
      }
    } catch (e) {
      res.json({ message: e.message })
    }
  })
)

router.post(
  '/:id/reviews',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const productId = req.params.id
    const product = await Product.findById(productId)
    if (product) {
      if (product.reviews.find((x) => x.name === req.user.name)) {
        return res
          .status(400)
          .send({ message: 'Ya calificaste' })
      }
      const review = {
        name: req.user.name,
        rating: Number(req.body.rating),
        comment: req.body.comment
      }
      product.reviews.push(review)
      product.numReviews = product.reviews.length
      product.rating =
        product.reviews.reduce((a, c) => c.rating + a, 0) /
        product.reviews.length
      const updatedProduct = await product.save()
      res.status(201).send(updatedProduct.reviews[updatedProduct.reviews.length - 1])
    } else {
      res.status(404).send({ message: 'Producto no encontrado' })
    }
  })
)

module.exports = router
