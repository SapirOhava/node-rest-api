const express = require('express');
const mongoose = require('mongoose');
const Order = require('../models/order');
const Product = require('../models/product');

const router = express.Router();
// body parser , parses only url encoded or json bodies
// form data (multi part form data) is a different kind of body,
// which you can submit both fields and files
// to be able to read this kind of incoming request body
// we need a separate package( multer ) instead of our package bodyParser

router.get('/', async (req, res, next) => {
  try {
    const docs = await Order.find()
      .select('product quantity _id')
      .populate('product', 'name')
      .exec();
    res.status(200).json({
      count: docs.length,
      orders: docs.map((doc) => ({
        _id: doc._id,
        product: doc.product,
        quantity: doc.quantity,
        request: {
          type: 'GET',
          url: `http://localhost:3000/orders/${doc._id}`,
        },
      })),
    });
  } catch (err) {
    res.status(500).json({
      error: err,
    });
  }
});

router.post('/', async (req, res, next) => {
  try {
    const product = await Product.findById(req.body.productId).exec();

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const order = new Order({
      _id: new mongoose.Types.ObjectId(),
      product: req.body.productId,
      quantity: req.body.quantity,
    });
    const result = await order.save();
    res.status(201).json({
      message: 'Order stored',
      createdOrder: {
        _id: result._id,
        product: result.product,
        quantity: result.quantity,
      },
      request: {
        type: 'GET',
        url: `http://localhost:3000/orders/${result._id}`,
      },
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      error: err,
    });
  }
});

router.get('/:orderId', async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.orderId)
      .populate('product')
      .exec();
    if (!order) {
      return res.status(404).json({
        message: 'Order not found',
      });
    }
    res.status(200).json({
      order: order,
      request: {
        type: 'GET',
        url: 'http://localhost:3000/orders',
      },
    });
  } catch (err) {
    res.status(500).json({
      error: err,
    });
  }
});

router.delete('/:orderId', async (req, res, next) => {
  try {
    const id = req.params.orderId;
    console.log('id : ', id);
    const result = await Order.deleteMany({ _id: id }).exec();
    res.status(200).json({
      message: 'Order deleted',
      result,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err });
  }
});

module.exports = router;
