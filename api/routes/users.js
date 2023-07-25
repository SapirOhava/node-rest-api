const express = require('express');

const router = express.Router();
const UsersController = require('../controllers/users');
const checkAuth = require('../middleware/check-auth');

// we don't need to do logged out endpoint because we don't store
// information about the user on the server
// so we cant logged out the user

router.get('', UsersController.users_get_all_users);

router.get('/:userId', UsersController.users_get_user);

router.post('/signup', UsersController.users_signup);

// i can also add another middleware for authorization,
// which means that this particular user has the authorization to delete a user
router.delete('/:userId', checkAuth, UsersController.users_delete_user);

router.post('/login', UsersController.users_login);
module.exports = router;
