const router = require('express').Router();
const loginController = require('../controllers/loginController');
const { validate } = require('../middleware/validator');

router.post(
  '/login/teacher',
  loginController.teacherValidationRules(),
  validate,
  loginController.loginTeacher
);

module.exports = router;
