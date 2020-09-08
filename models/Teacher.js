const mongoose = require('mongoose');

const { Schema } = mongoose;

/**
 * @swagger
 *  components:
 *    schemas:
 *      Teacher:
 *        type: object
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
 *          role:
 *            type: string
 *            description: User role, typically role Teacher for all teachers
 *          schools:
 *            type: array
 *            description: The schools that this teacher is registered in
 *          classes:
 *            type: array
 *            description: The classes that this teacher has
 *          subjects:
 *            type: array
 *            description: The subjects that this teacher teaches
 *        example:
 *           firstName: John
 *           lastName: Doe
 *           levelTaught: Primary
 *           email: john.doe@email.com
 *           role: Teacher
 *           schools: []
 *           classes: []
 *           subjects: []
 *
 */

const teacherSchema = new Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    levelTaught: { type: String, required: true },
    schools: [{ type: Schema.Types.ObjectId, ref: 'School' }],
    classes: [{ type: Schema.Types.ObjectId, ref: 'Class' }],
    subjects: [{ type: Schema.Types.ObjectId, ref: 'Subject' }],
    email: { type: String, required: true },
    password: { type: String, required: true },
    role: { type: String, default: 'Teacher' },
  },
  { timestamps: true }
);

const Teacher = mongoose.model('Teacher', teacherSchema);
module.exports = Teacher;
