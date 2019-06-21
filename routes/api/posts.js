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

      console.log(newPost);
      const post = await newPost.save();
      return res.status(200).json({ post });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

//@route  GET
//@desc   Get all the post
//@access Private
router.get('/', auth, async (req, res) => {
  try {
    const posts = await Post.find().sort({ date: -1 });
    return res.status(200).json({ posts });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

//@route  GET
//@desc   Get the post using Id
//@access Private
router.get('/:id', auth, async (req, res) => {
  try {
    const posts = await Post.findById(req.params.id);
    if (!posts) {
      return res.status(404).json({ msg: 'No post found' });
    }
    return res.status(200).json({ posts });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'No post found' });
    }
    res.status(500).send('Server Error');
  }
});

//@route  Delete
//@desc   Delete a post
//@access Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const posts = await Post.findById(req.params.id);
    //check post is available or not
    if (!posts) {
      return res.status(404).json({ msg: 'No post found' });
    }
    //check user
    if (posts.user.toString() !== req.user.id) {
      return res.status(400).send('user not authorized');
    }
    await posts.remove();
    return res.status(200).send('deleted successfully');
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});
module.exports = router;
