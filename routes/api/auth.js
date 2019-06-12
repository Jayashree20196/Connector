const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const User = require('../../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('config');
const { check, validationResult } = require('express-validator/check');

//@route  GET auth
//@desc   authenticate the user
//@access PUBLIC
router.get('/', auth, async (req, res) => {
  try {
    //get the profile of user, eliminating the password field
    const user = await User.findById(req.user.id).select('-password');
    res.send(user);
  } catch (err) {
    res.status(500).send('server error');
  }
});

//@route  POST auth
//@desc   Login user returns token
//@access PUBLIC
router.post(
  '/',
  [
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
    const { email, password } = req.body;
    try {
      const users = await User.findOne({ email });

      if (!users) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'Invalid credentials' }] });
      }
      //check whether the given password and db password are same after decrypting
      const isMatch = await bcrypt.compare(password, users.password);

      if (!isMatch) {
        return res.status(400).json({ errors: [{ msg: 'Password Invalid' }] });
      }

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
