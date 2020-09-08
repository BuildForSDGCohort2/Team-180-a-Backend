const jwt = require('jsonwebtoken');
const bCrypt = require('bcrypt');
const { body } = require('express-validator');
const { responseHandler } = require('../utils/responseHandler');
const TeacherModel = require('../models/Teacher');

const { TOKEN_SECRET } = process.env;

// teacher data validation rules
exports.teacherValidationRules = () => [
  body(
    'firstName',
    'firstname is required and it should be a string'
  ).isString(),
  body('lastName', 'lastname is required and it should be a string').isString(),
  body(
    'levelTaught',
    'levelTaught is required and it should be a string'
  ).isString(),
  body('email', 'email is required').isEmail(),
  body('password', 'password is required').isLength({ min: 6 }),
];

exports.registerTeacher = async (req, res) => {
  let { firstName, lastName, levelTaught, email, password } = req.body;
  try {
    // duplicate check
    let teacher = await TeacherModel.findOne({ email });
    if (teacher) {
      return responseHandler(res, 'Email already taken', 409, false, '');
    }
    password = await bCrypt.hash(password, 10);
    teacher = await TeacherModel.create({
      firstName,
      lastName,
      levelTaught,
      email,
      password,
    });
    // create and sign json web token for this user
    const token = jwt.sign(
      {
        email,
        user_role: teacher.role,
        _id: teacher._id,
      },
      TOKEN_SECRET,
      { expiresIn: '24h' }
    );
    // save user data to db
    await teacher.save();
    const data = {};
    data.user = teacher;
    data.token = token;
    return responseHandler(
      res,
      'Teacher registered successfuly',
      201,
      true,
      data
    );
  } catch (error) {
    return responseHandler(
      res,
      'Something went wrong please try again',
      500,
      false,
      error.message
    );
  }
};
