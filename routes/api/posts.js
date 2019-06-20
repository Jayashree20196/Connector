const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator/check');
const auth = require('../../middleware/auth');

//add models
const Profile = require('../../models/Profile');
const User = require('../../models/User');
const Post = require('../../models/Post');

//@route  post
//@desc   Add a user posts
//@access Private
router.post(
  '/',
  [
    auth,
    [
      check('text', 'Text is required')
        .not()
        .isEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(404).json({ errors: errors.array() });
    }
    try {
      const user = User.findById({ user: req.user.id }).select('-password');
      const newPost = new Post({
        text: req.body.text,
        name: User.name,
        avatar: User.avatar,
        user: req.user.id
      });
      const post = await newPost.save();
      return res.status(200).json({ post });
      // console.log(user);
      // res.send('post works');
    } catch (err) {
      console.error(err);
      res.status(500).send('Server Error');
    }
  }
);

module.exports = router;
