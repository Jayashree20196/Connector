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
    //pull out the fields from request body
    const {
      company,
      website,
      location,
      bio,
      status,
      githubusername,
      skills,
      youtube,
      twitter,
      facebook,
      instagram,
      linkedin
    } = req.body;

    const profileFields = {};
    profileFields.user = req.user.id;
    if (company) profileFields.company = company;
    if (website) profileFields.website = website;
    if (location) profileFields.location = location;
    if (bio) profileFields.bio = bio;
    if (status) profileFields.status = status;
    if (githubusername) profileFields.githubusername = githubusername;
    if (skills) {
      //split the string with , and add it as array
      profileFields.skills = skills.split(',').map(skills => skills.trim());
    }

    profileFields.social = {};
    if (youtube) profileFields.social.youtube = youtube;
    if (twitter) profileFields.social.twitter = twitter;
    if (facebook) profileFields.social.facebook = facebook;
    if (instagram) profileFields.social.instagram = instagram;
    if (linkedin) profileFields.social.linkedin = linkedin;
    try {
      //check if the profile already exists and update the fields
      let profile = await Profile.findOne({ user: req.user.id });
      if (profile) {
        profile = await Profile.findOneAndUpdate(
          { user: req.user.id },
          { $set: profileFields },
          { new: true }
        );
        return res.json(profile);
      }
      //create a new profile
      profile = new Profile(profileFields);
      await profile.save();
      res.json(profile);
    } catch (err) {
      console.error(err.message);
      return res.status(500).send('Server Errror');
    }
  }
);

module.exports = router;
