var express = require('express');
var expressAsyncHandler = require('express-async-handler');
var data = require('../data.js');
var Product = require('../models/productModel.js');
const { isAuth, isAdmin } = require('../utils.js');

var router = express.Router();

router.get(
  '/',
  expressAsyncHandler(async (req, res) => {
    try {
      const products = await Product.find({});
      res.send(products);
    } catch(e) {
      res.status(500).json({error: e})
    }
  })
);

router.post(
  '/',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const product = new Product({
      name: 'sample name',
      image: '/images/p1.jpg',
      price: 0,
      category: 'sample category',
      brand: 'sample brand',
      countInStock: 0,
      rating: 0,
      numReviews: 0,
      description: 'sample description',
    });
    try {
      const createdProduct = await product.save();
      res.send(createdProduct);
    } catch(e) {
      if (e.name === 'MongoError' && e.code === 11000) {
        e.message = "name already registered"
      }
      res.status(500).send({ message: e.message });
    }
  })
);

router.put(
  '/:id',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const productId = req.params.id;
    const product = await Product.findById(productId);
    if (product) {
      product.name = req.body.name;
      product.price = req.body.price;
      product.image = req.body.image;
      product.category = req.body.category;
      product.brand = req.body.brand;
      product.countInStock = req.body.countInStock;
      product.description = req.body.description;
      const updatedProduct = await product.save();
      res.send(updatedProduct);
    } else {
      res.status(404).send({ message: 'Product Not Found' });
    }
  })
);

router.delete(
  '/:id',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);
    if (product) {
      const deleteProduct = await product.remove();
      res.send(deleteProduct);
    } else {
      res.status(404).send({ message: 'Product Not Found' });
    }
  })
);

router.get(
  '/seed',
  expressAsyncHandler(async (req, res) => {
    // await Product.remove({});
    try{
      const createdProducts = await Product.insertMany(data.products);
      res.send({ createdProducts });
    } catch(e) {
      res.json({ message: e.message })
    }
  })
);

module.exports = router;
