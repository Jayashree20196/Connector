const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('config');

//Include model
const User = require('../../models/User');

//add express validator for validating user params
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
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { name, email, password } = req.body;
    try {
      const users = await User.findOne({ email });

      if (users) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'user already exits' }] });
      }
      //use gravator for profile image
      const avator = gravatar.url(email, {
        s: '200',
        r: 'pg',
        d: 'mm'
      });

      //creates new user instance
      user = new User({
        name,
        email,
        avator,
        password
      });

      //bcrypt password, create salt
      const salt = await bcrypt.genSalt(10);
      //encrypting the password using hash function
      user.password = await bcrypt.hash(password, salt);
      //save to database
      await user.save();

      //creating payload
      const payload = {
        user: {
          id: user.id
        }
      };
      //creating signature for JWT
      jwt.sign(
        payload,
        config.get('jwtToken'),
        { expiresIn: 360000 },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (err) {
      return res.status(500).json('server error');
    }
  }
);

module.exports = router;
