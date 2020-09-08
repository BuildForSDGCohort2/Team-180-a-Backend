const jwt = require('jsonwebtoken');
const bCrypt = require('bcrypt');
const { body } = require('express-validator');
const { responseHandler } = require('../utils/responseHandler');
const TeacherModel = require('../models/Teacher');

const { TOKEN_SECRET } = process.env;

// teacher data validation rules
exports.teacherValidationRules = () => [
  body('email', 'email is required').isEmail(),
  body('password', 'password is required').isLength({ min: 6 }),
];

exports.loginTeacher = async (req, res) => {
  const { password, email } = req.body;
  let user;
  try {
    user = await TeacherModel.find({ email });
    if (user.length) {
      if (user && (await bCrypt.compare(password, user[0].password))) {
        // create and sign json web token for this user
        const token = jwt.sign(
          {
            email,
            user_role: user[0].role,
            _id: user[0]._id,
          },
          TOKEN_SECRET,
          { expiresIn: '24h' }
        );
        const data = {};
        data.user = user;
        data.token = token;
        console.log(token);
        responseHandler(res, 'User logged in successfuly', 200, true, data);
      } else {
        responseHandler(res, 'Invalid credentials', 401, false, '');
      }
    } else {
      responseHandler(res, 'User not found', 404, false, '');
    }
  } catch (error) {
    responseHandler(res, 'Something went wrong', 500, false, error);
  }
};
