const jwt = require('jsonwebtoken');
const bCrypt = require('bcrypt');
const { body } = require('express-validator');
const { responseHandler } = require('../utils/responseHandler');
const TeacherModel = require('../models/Teacher');
const student = require("../models/Student");
const { studentValidation } = require("../middleware/studentValidation");


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

/**
 * @swagger
 *  components:
 *    schemas:
 *      TeacherCreateDto:
 *        type: object
 *        required:
 *          - firstName
 *          - lastName
 *          - levelTaught
 *          - email
 *          - password
 *        properties:
 *          firstName:
 *            type: string
 *            description: First name of the teacher
 *          lastName:
 *            type: string
 *            description: Last name of the teacher
 *          levelTaught:
 *            type: string
 *            description: The school level that the teacher teaches
 *          email:
 *            type: string
 *            format: email
 *            description: Email for the teacher, needs to be unique.
 *          password:
 *            type: string,
 *            description: The password the teacher will use to login.
 *            minLength: 6
 *        example:
 *           firstName: John
 *           lastName: Doe
 *           levelTaught: Primary
 *           email: john.doe@email.com
 *           password: wer4590
 */
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


exports.registerStudent = async (req, res) => {

  let { firstName, lastName, levelTaught, email, password } = req.body;

  try {
    //validate pwd, email, and username
    const { error } = studentValidation(req.body);
    if (error) return responseHandler(res, error.details[0].message, 400, false, '');

    // check if email is already in the database
    const emailExist = await student.findOne({ email: req.body.email });
    if (emailExist) return responseHandler(res, 'Email already taken', 409, false, '');

    //hash pwd
    const salt = bCrypt.genSaltSync(10);
    const hashedPassword = bCrypt.hashSync(req.body.password, salt);

    // create new and save the new user to the database
    const newStudent = new student({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      password: hashedPassword,
      level: req.body.level

    });

    // create and sign json web token for this user
    const token = jwt.sign(
      {
        email,
        user_role: student.role,
        _id: student._id,
      },
      TOKEN_SECRET
    );

    const savedStudent = await newStudent.save();
    const data = {};
    data.user = student;
    data.token = token;
    return responseHandler(res, 'Student registered successfully', 201, true, savedStudent);

  } catch (err) {
    return responseHandler(res, 'Unable to register Student', 400, false, "");

  }
}