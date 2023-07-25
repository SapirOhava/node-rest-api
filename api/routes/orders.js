const express = require('express');

const checkAuth = require('../middleware/check-auth');
const OrdersController = require('../controllers/orders');

const router = express.Router();
// body parser , parses only url encoded or json bodies
// form data (multi part form data) is a different kind of body,
// which you can submit both fields and files
// to be able to read this kind of incoming request body
// we need a separate package( multer ) instead of our package bodyParser

router.get('/', checkAuth, OrdersController.orders_get_all);

router.post('/', checkAuth, OrdersController.orders_create_order);

router.get('/:orderId', checkAuth, OrdersController.orders_get_order);

router.delete('/:orderId', checkAuth, OrdersController.orders_delete_order);

module.exports = router;
