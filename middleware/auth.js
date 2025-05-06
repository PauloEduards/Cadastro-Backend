const jwt = require('jsonwebtoken')
const secret = 'dfalkghsdfkhgdkfsjg'

function generateToken(user) {
  const token = jwt.sign({ ...user }, secret, {
    expiresIn: '1h',
  });
  return token;
}

function verifyToken(token) {
  try {
    return jwt.verify(token, secret);
  } catch (err) {
    return null;
  }
}

function authMiddleware(req, res, next) {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }
  const decoded = verifyToken(token);
  if (!decoded) {
    return res.status(401).json({ message: 'Invalid token' });
  }
  
  next();
}



module.exports = { generateToken, authMiddleware }