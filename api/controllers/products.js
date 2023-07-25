const mongoose = require('mongoose');
const Product = require('../models/product');

exports.products_get_all = async (req, res, next) => {
  try {
    const docs = await Product.find()
      .select('name price _id productImage')
      .lean()
      .exec();
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
};

exports.products_create_product = async (req, res, next) => {
  try {
    const product = new Product({
      _id: new mongoose.Types.ObjectId(),
      name: req.body.name,
      price: req.body.price,
      productImage: req.file.path,
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
};

exports.products_get_product = async (req, res, next) => {
  const id = req.params.productId;
  try {
    const doc = await Product.findById(id)
      .select('name price _id productImage')
      .lean()
      .exec();
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
};

exports.products_delete_product = async (req, res, next) => {
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
};

exports.products_update_product = async (req, res, next) => {
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
};
