const express = require('express');
const multer = require('multer');
const checkAuth = require('../middleware/check-auth');
const ProductsController = require('../controllers/products');

const router = express.Router();

const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: function (req, file, cb) {
    const date = new Date().toISOString().replace(/:/g, '-');
    cb(null, `${date}-${file.originalname}`);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    // save the file
    cb(null, true);
  } else {
    // reject the file
    cb(null, false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5,
  },
  fileFilter: fileFilter,
});

router.get('/', ProductsController.products_get_all);
router.post(
  '/',
  checkAuth,
  upload.single('image'),
  ProductsController.products_create_product
);
router.get('/:productId', ProductsController.products_get_product);
router.delete(
  '/:productId',
  checkAuth,
  ProductsController.products_delete_product
);

router.patch(
  '/:productId',
  checkAuth,
  ProductsController.products_update_product
);
module.exports = router;
