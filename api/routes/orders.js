const express = require('express');
const mongoose = require('mongoose');
const Order = require('../models/order');

const router = express.Router();

router.get('/', (req, res, next) => {
  res.status(200).json({
    message: 'Orders were fetched',
  });
});

router.post('/', async (req, res, next) => {
  try {
    const order = new Order({
      _id: mongoose.Types.ObjectId(),
      product: req.body.productId,
      quantity: req.body.quantity,
    });
    const result = await order.save().exec();
    result.status(201).json(result);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      error: err,
    });
  }
});

module.exports = router;
