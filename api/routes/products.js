const express = require('express');
const mongoose = require('mongoose');

const router = express.Router();
const Product = require('../models/product');

router.get('/', async (req, res, next) => {
  try {
    const docs = await Product.find().select('name price _id').exec();
    const response = {
      count: docs.length,
      products: docs.map((doc) => ({
        ...doc,
        request: {
          type: 'GET',
          description: 'Get product data',
          url: `http://localhost:3000/products/${doc._id}`,
        },
      })),
    };
    res.status(200).json(response);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err });
  }
});

router.post('/', async (req, res, next) => {
  try {
    const product = new Product({
      _id: new mongoose.Types.ObjectId(),
      name: req.body.name,
      price: req.body.price,
    });
    const result = await product.save();
    console.log(result);
    res.status(201).json({
      message: 'Created product successfully',
      createdProduct: {
        name: result.name,
        price: result.price,
        _id: result._id,
        request: {
          type: 'GET',
          description: 'Get product data',
          url: `http://localhost:3000/products/${result._id}`,
        },
      },
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err });
  }
});

router.get('/:productId', async (req, res, next) => {
  const id = req.params.productId;
  try {
    const doc = await Product.findById(id).select('name price _id').exec();
    res.status(200).json({
      product: doc,
      request: {
        type: 'GET',
        description: 'Get all products',
        url: 'http://localhost:3000/products',
      },
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err });
  }
});

router.delete('/:productId', async (req, res, next) => {
  try {
    const id = req.params.productId;
    const result = await Product.deleteMany({ _id: id }).exec();
    res.status(200).json({
      message: 'Deleted product successfully',
      result: result,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err });
  }
});

router.patch('/:productId', async (req, res, next) => {
  try {
    const id = req.params.productId;
    const updateOps = {};
    for (const ops of req.body) {
      updateOps[ops.propName] = ops.value;
    }
    const result = await Product.updateOne(
      { _id: id },
      { $set: updateOps }
    ).exec();
    res.status(200).json({
      message: 'Product updated',
      request: {
        type: 'GET',
        description: 'Get product data',
        url: `http://localhost:3000/products/${id}`,
      },
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err });
  }
});

module.exports = router;
