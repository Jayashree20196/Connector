const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
//importing models
const Profile = require('../../models/Profile');
const User = require('../../models/User');
//validator check for request body
const { check, validationResult } = require('express-validator/check');

//@route  GET profile/me
//@desc   user profile
//@access PUBLIC
router.get('/me', auth, async (req, res) => {
  try {
    //Get the particular profile using id
    const profile = await Profile.findOne({ user: req.user.id }).populate(
      'user',
      ['name', 'avator']
    );

    //checks if profile is empty
    if (!profile) {
      return res.status(400).send('This user has no profile');
    }
    //returns the value into json format
    return res.status(200).json(profile);
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

//@route  Get All profile
//@desc   user profile
//@access PUBLIC

router.get('/', async (req, res) => {
  try {
    const profiles = await Profile.find().populate('user', ['name', 'avator']);
    res.json(profiles);
  } catch (err) {
    console.error(err.message);
    return res.status(500).send('Server Error');
  }
});

//@route  Get  profile/user/:user_id
//@desc   Get one user profile using objectId
//@access PUBLIC
router.get('/users/:user_id', async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.params.user_id
    }).populate('user', ['name', 'avator']);

    if (!profile) {
      return res.status(400).json({ msg: 'profile not found' });
    }

    res.json(profile);
  } catch (err) {
    console.error(err.message);
    return res.status(500).send('Server Error');
  }
});

//@route  Delete a profile
//@desc   Delete a user profile with token
//@access PUBLIC

router.delete('/', auth, async (req, res) => {
  try {
    //Remove profile
    await Profile.findOneAndRemove({ user: req.user.id });
    //Remove user
    await User.findOneAndRemove({ _id: req.user.id });
    res.json('user deleted successfully');
  } catch (err) {
    console.error(err.message);
    return res.status(500).send('Server Error');
  }
});

//@route  Put to update a profile
//@desc   update the profile details with experience
//@access PRIVATE

router.put(
  '/experience',
  auth,
  [
    check('title', 'title is required')
      .not()
      .isEmpty(),
    check('company', 'company is required')
      .not()
      .isEmpty(),
    check('from', 'from date is required')
      .not()
      .isEmpty()
  ],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      title,
      company,
      location,
      from,
      to,
      current,
      description
    } = req.body;
    //since the key value pair are same, we can neglect the key
    const newExp = {
      title,
      company,
      location,
      from,
      to,
      current,
      description
    };

    try {
      const profile = await Profile.findOne({ user: req.user.id });
      profile.experience.unshift(newExp);
      await profile.save();
      res.status(200).json({ profile });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('server errror');
    }
  }
);

//@route  DELETE  profile/experience
//@desc   Delete one experience of the profile
//@access PRIVATE
router.delete('/experience/:exp_id', auth, async (req, res) => {
  try {
    //get the user profile using id
    const profile = await Profile.findOne({ user: req.user.id });
    //map through the user p
    const removeIndex = profile.experience
      .map(item => item.id)
      .indexOf(req.params.exp_id);
    //removing the experience from profile
    await profile.experience.splice(removeIndex, 1);
    //save the profile data
    profile.save();
    res.status(200).json({ profile });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('server errror');
  }
});

//@route  Put to update a profile
//@desc   update the profile details with education
//@access PRIVATE
router.put(
  '/education',
  auth,
  [
    check('school', 'school details are required')
      .not()
      .isEmpty(),
    check('degree', 'degree is required')
      .not()
      .isEmpty(),
    check('fieldOfStudy', 'field of study is required')
      .not()
      .isEmpty()
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const profile = await Profile.findOne({ user: req.user.id });
      const {
        school,
        degree,
        fieldOfStudy,
        from,
        to,
        current,
        description
      } = req.body;

      const newEdu = {
        school,
        degree,
        fieldOfStudy,
        from,
        to,
        current,
        description
      };
      await profile.education.unshift(newEdu);
      profile.save();
      return res.status(200).json({ profile });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('server error');
    }
  }
);
//@route  DELETE  profile/education
//@desc   Delete one education of the profile
//@access PRIVATE
router.delete('/education/:edu_id', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });
    const removeIndex = profile.education
      .map(item => item.id)
      .indexOf(req.params.edu_id);
    await profile.education.splice(removeIndex, 1);
    profile.save();
    res.status(200).json({ profile });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});
module.exports = router;
