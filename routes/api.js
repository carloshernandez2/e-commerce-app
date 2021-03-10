const data = require('../data.js');
const expressAsyncHandler = require('express-async-handler');
const User = require('../models/userModel.js');

var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/products', (req, res) => {
  res.send(data);
});

router.get('/users/seed', expressAsyncHandler(async (req, res) => {
    // await User.remove({});
    const createdUsers = await User.insertMany(data.users);
    res.send({ createdUsers });
  })
);

module.exports = router;
