const router = require('express').Router();
const loginController = require('../controllers/loginController');
const { validate } = require('../middleware/validator');

router.post(
  '/login/user',
  loginController.userLoginValidationRules(),
  validate,
  loginController.loginUser
);

module.exports = router;
