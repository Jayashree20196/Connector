const jwt = require('jsonwebtoken');
const config = require('config');


//Get Token
//Verify if not
//if available then process
module.exports = function(req, res, next) {
  //Get token from header
  const token = req.header('x-auth-token');
  //check token valid
  if (!token) {
    return res.status(401).json({ msg: 'No token, authentication denied' });
  }

  try {
    //decode the token, if valid
    const decoded = jwt.verify(token, config.get('jwtToken'));
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Not a valid token' });
  }
};
