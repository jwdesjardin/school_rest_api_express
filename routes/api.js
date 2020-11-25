var express = require('express');
var router = express.Router();
const User = require('../models').User;
const Course = require('../models').Course;
const userValidator = require('./middleware/userValidation');
const courseValidator = require('./middleware/courseValidation');
const authorization = require('./middleware/authorization');
const bcrypt = require('bcryptjs');

/* Handler function to wrap each route. */
function asyncHandler(cb){
  return async(req, res, next) => {
    try {
      await cb(req, res, next)
    } catch(error){
      // Forward error to the global error handler
      next(error);
    }
  }
}

router.get('/', (req, res) => {
  res.json({
    message: 'Welcome to the REST API home page',
  });
})

/* GET  */
router.get('/users', authorization, asyncHandler(async (req, res) => {
//Returns the currently authenticated user
  const users = await User.findAll({
    attributes: { exclude: ['password', 'createdAt', 'updatedAt']}
  });
  res.status(200).json(users);
}));

/* POST  */
router.post('/users', userValidator, asyncHandler(async (req, res) => {
  //Creates a user, sets the Location header to "/", and returns no content
  
  let password = req.body.password;
  req.body.password = bcrypt.hashSync(password, 10);

  try {
    const user = await User.create(req.body);
    res.location('/');
    res.status(201).send('Successfuly created User');
  } catch (error) {
      const err = new Error('That Email is already in use');
      err.status = 400;
      throw err;
    }
  
}));


/* get  */
router.get('/courses', asyncHandler(async (req, res) => {
  //Returns a list of courses (including the user that owns each course)
  const courses = await Course.findAll({
    attributes: { exclude: ['createdAt', 'updatedAt']},
    include: [{
      model: User,
      as: 'user',
      attributes: { exclude: ['password', 'createdAt', 'updatedAt']}
    }]
  });
  res.status(200).json(courses);
}));

/* GET  */
router.get('/courses/:id', asyncHandler(async (req, res) => {
  //Returns the course (including the user that owns the course) for the provided course ID
  const course = await Course.findByPk(req.params.id, {
    attributes: { exclude: ['createdAt', 'updatedAt']},
    include: [{
      model: User,
      as: 'user',
      attributes: { exclude: ['password', 'createdAt', 'updatedAt']}
    }]
  });
  if (course){
    res.status(200).json(course);
  } else {
    const error = new Error('Course could not be found');
    error.status = 404;
    throw error;
  }
}));

/* POST  */
router.post('/courses', authorization, courseValidator, asyncHandler(async (req, res) => {
  //Creates a course, sets the Location header to the URI for the course, and returns no content
  
    const course = await Course.create(req.body);
    res.location('/');
    res.status(201).send('Successfuly created Course');
 
}));

/* PUT  */
router.put('/courses/:id', authorization, courseValidator, asyncHandler(async (req, res) => {
  //Updates a course and returns no content
    
    let course = await Course.findByPk(req.params.id);
    if(course) {

      if (req.currentUser.id === course.userId){
        await course.update(req.body);
        res.status(204).send('Successfuly updated Course'); 
      } else {
        res.status(403).send('This course does not belong to the logged in user')
      }

    } else {
      const error = new Error('Could not find the course to update');
      error.status = 404;
      throw error;
    }
  
})); 

/* DELETE  */
router.delete('/courses/:id', authorization, asyncHandler(async (req, res) => {
  //Deletes a course and returns no content
  const course = await Course.findByPk(req.params.id);
  if(course) {
    await course.destroy();
    res.status(204).send('Successfuly deleted Course');
  } else {
    const error = new Error('The Course could not be located and was not deleted');
    error.status = 404;
    throw error;
  }
  
}));


module.exports = router;