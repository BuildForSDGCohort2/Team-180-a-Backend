const jwt = require('jsonwebtoken');
const bCrypt = require('bcrypt');
const { body } = require('express-validator');
const { responseHandler } = require('../utils/responseHandler');
const TeacherModel = require('../models/Teacher');
const StudentModel = require('../models/Student');

const { TOKEN_SECRET } = process.env;

// user data validation rules
exports.userLoginValidationRules = () => [
  body('email', 'email is required').isEmail(),
  body('password', 'password is required').isLength({ min: 6 }),
];

exports.loginUser = async (req, res) => {
  const { password, email } = req.body;
  let user;
  try {
    user = await TeacherModel.findOne({ email });
    if (user) {
      if (await bCrypt.compare(password, user.password)) {
        // create and sign json web token for this user
        const token = jwt.sign(
          {
            email,
            user_role: user.role,
            _id: user._id,
          },
          TOKEN_SECRET,
          { expiresIn: '24h' }
        );
        const data = {};
        data.user = user;
        data.token = token;
        return responseHandler(
          res,
          'User logged in successfuly',
          200,
          true,
          data
        );
      }
      return responseHandler(res, 'Invalid credentials', 401, false, '');
    }
    user = await StudentModel.findOne({ email });
    if (!user) {
      return responseHandler(res, 'User not found', 404, false, '');
    }
    if (await bCrypt.compare(password, user.password)) {
      // create and sign json web token for this user
      const token = jwt.sign(
        {
          email,
          user_role: user.role,
          _id: user._id,
        },
        TOKEN_SECRET,
        { expiresIn: '24h' }
      );
      const data = {};
      data.user = user;
      data.token = token;
      return responseHandler(
        res,
        'User logged in successfuly',
        200,
        true,
        data
      );
    }
    return responseHandler(res, 'Invalid credentials', 401, false, '');
  } catch (error) {
    return responseHandler(res, 'Something went wrong', 500, false, error);
  }
};
