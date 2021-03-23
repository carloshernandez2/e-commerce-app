const multer = require('multer');
const express = require('express');
const { isAuth } = require('../utils.js');

const router = express.Router();

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'uploads/');
  },
  filename(req, file, cb) {
    cb(null, `${Date.now()}.jpg`);
  },
});

const upload = multer({ storage });

router.post('/', isAuth, upload.single('image'), (req, res) => {
  res.send(`/${req.file.path}`);
});

module.exports =  router;