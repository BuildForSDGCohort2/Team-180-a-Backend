const router = require('express').Router();
const registerController = require('../controllers/registerController');
const { validate } = require('../middleware/validator');

/**
 * @swagger
 * tags:
 *   name: Registration
 *   description: Register users routes
 */

/**
 * @swagger
 *  components:
 *    schemas:
 *      TeacherCreateResDto:
 *        type: object
 *        properties:
 *          success:
 *            type: boolean
 *            description: Signifies if the operation was a success
 *          message:
 *            type: string
 *            description: Operation message
 *          data:
 *            type: object
 *            properties:
 *              user:
 *                $ref: '#/components/schemas/Teacher'
 *              token:
 *                type: string
 *            description: returned data after the operation
 *        example:
 *           success: true
 *           message: Teacher Registered Successfully
 *           data: {user: {_id: 5f4fdf89f6eadd1ddf6d7d04, role: Teacher, firstName: John},
 *                  token: ...}
 */

/**
 * @swagger
 * path:
 *  /register/teacher:
 *    post:
 *      summary: Register a new teacher
 *      tags: [Registration]
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/TeacherCreateDto'
 *      responses:
 *        "200":
 *          description: The newly registered teacher details
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/TeacherCreateResDto'
 */

router.post(
  '/register/teacher',
  registerController.teacherValidationRules(),
  validate,
  registerController.registerTeacher
);

module.exports = router;
