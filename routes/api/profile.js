const express = require('express');
const router = express.Router();

//@route  GET profile
//@desc   user profile
//@access PUBLIC
router.get('/', (req, res) => {
  res.send('profile router');
});

module.exports = router;
