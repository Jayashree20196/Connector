const express = require('express');
const router = express.Router();

//add express validator
const { check, validationResult } = require('express-validator/check');

//@route  GET users
//@desc   List of users
//@access PUBLIC
router.get('/', (req, res) => {
  res.send('user get route');
});

//@route  POST users
//@desc   USER add with validation
//@access PUBLIC
router.post(
  '/',
  [
    check('name', 'name is required')
      .not()
      .isEmpty(),
    check('email', 'Enter valid email').isEmail(),
    check('password', 'password must atleast be in 6 characters').isLength({
      min: 6
    })
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    res.send('users router');
  }
);

module.exports = router;
