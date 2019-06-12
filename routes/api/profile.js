const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
//importing models
const Profile = require('../../models/Profile');
const User = require('../../models/User');

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

//@route  GET profile/me
//@desc   user profile
//@access PUBLIC
router.get(
  '/',
  auth,
  [
    check('status', 'status is required'),
    check('skills', 'skills are required')
  ],
  async (req, res) => {}
);

module.exports = router;
