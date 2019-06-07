const express = require('express');
const router = express.Router();

//@route  GET auth
//@desc   authenticate the user
//@access PUBLIC
router.get('/', (req, res) => {
  res.send('auth router');
});

module.exports = router;
