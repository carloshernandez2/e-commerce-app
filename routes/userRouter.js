const data = require('../data.js');
const expressAsyncHandler = require('express-async-handler');
const User = require('../models/userModel.js');
const { generateToken } = require('../utils.js');
const bcrypt = require('bcryptjs');

var express = require('express');
var router = express.Router();

router.get('/seed', expressAsyncHandler(async (req, res) => {
    // await User.remove({});
    const createdUsers = await User.insertMany(data.users);
    res.send({ createdUsers });
  })
);

router.post(
  '/signin',
  expressAsyncHandler(async (req, res) => {
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      if (bcrypt.compareSync(req.body.password, user.password)) {
        res.send({
          _id: user._id,
          name: user.name,
          email: user.email,
          isAdmin: user.isAdmin,
          token: generateToken(user),
        });
        return;
      }
    }
    res.status(401).send({ message: 'Invalid email or password' });
    return;
  })
);

router.post(
  '/register',
  expressAsyncHandler(async (req, res) => {
    const user = new User({
      name: req.body.name,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password, 8),
    });
    try {
      const createdUser = await user.save();
      res.send({
        _id: createdUser._id,
        name: createdUser.name,
        email: createdUser.email,
        isAdmin: createdUser.isAdmin,
        token: generateToken(createdUser),
      });
    } catch(e) {
      if (e.name === 'MongoError' && e.code === 11000) {
        e.message = "email already registered"
      }
      res.status(401).send({ message: e.message });
    }
  })
);

module.exports = router;
