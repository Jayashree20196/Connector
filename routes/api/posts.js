const express = require('express');
const router = express.Router();

//@route  GET posts
//@desc   user posts
//@access PUBLIC
router.get('/', (req, res) => {
  res.send('posts router');
});

module.exports = router;
