const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

exports.users_signup = async (req, res, next) => {
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
};

exports.users_delete_user = async (req, res, next) => {
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
};

exports.users_login = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(401).json({
        message: 'Auth failed',
      });
    }
    // as mentioned in the last video we cant reverse this hash,
    // so how can me match the hashed password with the plaintext password ?( because if we hash it again - in the same way - it wont give us the same hash !)
    // bcrypt use some algorithm for hashing the password( you can read more about it) but basically it returns true if
    // it finds out that both passwords were created with the same algorithm and key so they are the same passwords, even though! their hashes aren't the same.
    const match = await bcrypt.compare(req.body.password, user.password);
    if (match) {
      // jwt.sign creates the signed token , payload  is the data you want to put in the token
      // the secret key is the key that only known to the server ( we can also pass more options and a callback function that gets executed once the sign in done)
      // the expiresIn should be short because the token is stored on the client, and if someone steal this from the client he gets full access to our api.
      const token = jwt.sign(
        {
          email: user.email,
          userId: user._id,
        },
        process.env.JWT_KEY,
        {
          expiresIn: '1h',
        }
      );
      return res.status(200).json({
        message: 'Auth successful',
        token,
      });
    }
    return res.status(401).json({
      message: 'Auth failed',
    });
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
};

exports.users_get_user = async (req, res, next) => {
  const id = req.params.userId;
  try {
    const doc = await User.findById(id).select('email _id').lean().exec();
    res.status(200).json({
      user: doc,
      request: {
        type: 'GET',
        description: 'Get all users',
        url: 'http://localhost:3000/user',
      },
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err });
  }
};

exports.users_get_all_users = async (req, res, next) => {
  try {
    const docs = await User.find().select('email  _id').lean().exec();
    const response = {
      count: docs.length,
      users: docs.map((doc) => ({
        ...doc,
        request: {
          type: 'GET',
          description: 'Get user data',
          url: `http://localhost:3000/user/${doc._id}`,
        },
      })),
    };
    res.status(200).json(response);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err });
  }
};
