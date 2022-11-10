const express = require('express');

const router = express.Router();

// CONTROLLERS
const { create, get, getById, getByEmail, edit, remove, block, unblock, resetpassword, uploadAvatar } = require('../controllers/users');

// MIDDLEWARES
const {
  emailIsUnique,
  emailIsValid,
  firstNameIsValid,
  lastNameIsValid,
  checkUserId,
  checkUserEmail,
  passwordIdValid,
  tokenIsValid,
  isAdmin,
  userHasAccess,
  profilePictureHandler
} = require('../middlewares');


// Example: http://localhost:3000/users - Need a valid token!
router.get('/', [tokenIsValid], get);

// Example: http://localhost:3000/users/1 - Need a valid token! - Need a extUser or admin token!
router.get('/:id', [tokenIsValid, checkUserId], getById);

// Example: http://localhost:3000/users/email/ext@usr.com - Need a valid token!
router.get('/email/:email', [tokenIsValid, checkUserEmail], getByEmail);

// Example: http://localhost:3000/users/email/ext@usr.com - Need a valid token!
router.post('/', [firstNameIsValid, lastNameIsValid, passwordIsValid, emailIsValid, emailIsUnique], create);

router.post('/profile-pic', [tokenIsValid, profilePictureHandler], uploadAvatar);

router.put('/:id', [tokenIsValid, userHasAccess, firstNameIsValid, lastNameIsValid, passwordIsValid, checkUserId], edit);

// Example: http://localhost:3000/users/1 - Need a valid token! - Need a extUser or admin token!
router.delete('/:id', [tokenIsValid, isAdmin, checkUserId], remove);

// Example: http://localhost:3000/users/block/1 - Need a valid token! - Need a extUser or admin token!
router.patch('/block/:id', [tokenIsValid, isAdmin, checkUserId], block);

// Example: http://localhost:3000/users/block/1 - Need a valid token! - Need a extUser or admin token!
router.patch('/unblock/:id', [tokenIsValid, isAdmin, checkUserId], unblock);

// Example: http://localhost:3000/users/block/1 - Need a valid token! - Need a extUser or admin token!
router.patch('/resetPassword/:id', [tokenIsValid, isAdmin, checkUserId], resetpassword);

module.exports = router;
