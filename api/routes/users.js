const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('../models/user');

const router = express.Router();
// we don't need to do logged out endpoint because we don't store
// information about the user on the server
// so we cant logged out the user

router.post('/signup', async (req, res, next) => {
  // if we hash a password, theoretically its safe because you cant reverse a hash( you cant translate a hash to the plaintext value , its a one way operation , how we then able to verify its the correct password he'll come back to this  )
  // but if we google that hash code theres a good chance we will find the translation( the plain text field)
  // because every plaintext string has a clear unique hashed version of it with the hashing algorithm used in it
  // thats what called dictionary tables, these dictionary tables are tables with the plain text and their hashed values
  // the idea behind salting is that we add random strings to the plaintext password before we hash it and then store it in the db .
  // by doing it like this googling the hash wont lead to the plaintext version of the password because we change it- we added random strings and also( we don't have hashing to table to all random strings , only for common words)
  // the second arg is the number of salting rounds - 10 considered safe
  // the third arg is a callback func where we either get an error or we get the hashed password
  try {
    console.log(req.body);
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    const userExist = await User.find({ email: req.body.email }).exec();
    if (userExist.length >= 1) {
      return res.status(409).json({
        message: 'Mail already exist',
      });
    }
    const user = new User({
      _id: new mongoose.Types.ObjectId(),
      email: req.body.email,
      password: hashedPassword,
    });

    await user.save();

    console.log(user);

    res.status(200).json({
      message: 'User created successfully',
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
});

router.delete('/:userId', async (req, res, next) => {
  try {
    const { userId } = req.params;

    // Find and delete the user with the specified ID
    const result = await User.findByIdAndDelete(userId);

    if (!result) {
      return res.status(404).json({
        message: 'User not found',
      });
    }

    res.status(200).json({
      message: 'User deleted successfully',
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      error: error.message,
    });
  }
});

module.exports = router;