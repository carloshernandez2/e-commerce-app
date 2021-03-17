var express = require('express');
var expressAsyncHandler = require('express-async-handler');
var data = require('../data.js');
var Product = require('../models/productModel.js');

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
