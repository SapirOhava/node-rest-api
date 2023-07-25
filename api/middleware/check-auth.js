// checks if the user is authenticated or not
// i'm exporting an arrow function with the default
// middleware pattern in express
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    // the verify method returns the decoded token if
    // its a valid token , otherwise it throws an error

    // its split the 'bearer ' from the token
    // also its important that the client insert the token
    // to its headers ! and not post - body !
    // for example in our post route, were getting form data and not
    // json data , and in the app.js file we only got body parsers
    // for urlencoded and json content type requests, in the post route
    // which we use form data. the middleware that parsers this form of requests data
    // is the upload.single('image'), it also extracts the file along the way
    // since checkAuth runs prior to this, the requests body will not be
    // populated , because it hasn't been parsed yet.
    // theres the option to switch both middleware's by that the checkAuth will
    // be the second , by we do the unnecessary work without checking if its authenticated
    // and also what do we do when its a get request ?( without body )
    // and now when the token in the header we don't need to parse the body
    const token = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_KEY);
    req.userData = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      message: 'Auth failed',
    });
  }
};
