const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const User = require('../../models/User');

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

module.exports = router;
