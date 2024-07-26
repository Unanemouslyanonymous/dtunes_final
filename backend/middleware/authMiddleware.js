/**
 tofo
 1) jwt token is the bearer header

 2) check if user is authenticated

 3) if not return error
 */
import jwt from 'jsonwebtoken';
import {User} from '../models/User.js';

const auth = async (req, res, next) => {
  const authHeader = req.header('Authorization');

  if (!authHeader) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  const token = authHeader.replace('Bearer ', '');

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('decoded',decoded);
    req.user = await User.findById(decoded.user.id).select('-password');
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

export default auth;
