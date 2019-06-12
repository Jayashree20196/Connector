const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
//importing models
const Profile = require('../../models/Profile');
const User = require('../../models/User');

const { check, validationResult } = require('express-validator/check');

//@route  GET profile/me
//@desc   user profile
//@access PUBLIC
router.get('/me', auth, async (req, res) => {
  try {
    //Get the particular profile using id
    const profile = await Profile.findOne({ user: req.user.id }).populate(
      'user',
      ['name', 'avatar']
    );
    //checks if profile is empty
    if (!profile) {
      return res.status(400).send('This user has no profile');
    }
  } catch (err) {
    res.status(500).send('server error');
  }
});

//@route  POST profile/me
//@desc   user profile
//@access PUBLIC
router.post(
  '/',
  auth,
  [
    check('status', 'status is required')
      .not()
      .isEmpty(),
    check('skills', 'skills are required')
      .not()
      .isEmpty()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
    }
  }
);

module.exports = router;
