import { User } from '../models/User.js';
import { getAccessToken, getAuthUrl, getKey, verifyToken } from '../utils/dauthAuth.js';
import axios from 'axios';
import jwt from 'jsonwebtoken';

export const handleLogin = (req, res) => {
  const authUrl = getAuthUrl();
  res.redirect(authUrl);
};

export const handleCallback = async (req, res) => {
  const { code } = req.query;
  try {
    const data = await getAccessToken(code);
    const id_token = data.id_token;
    const accessToken = data.access_token;  
     console.log('callback has goen thro',accessToken,id_token);
     const decoded_token = await verifyToken(id_token);
     console.log('decoded token',decoded_token);
    const userResponse = await axios.post('https://auth.delta.nitt.edu/api/resources/user',{}, {
      headers: {
        Authorization: `Bearer ${accessToken}`, 
      },
    });
    console.log('user response',userResponse.data);
    const userData = userResponse.data;
    let user = await User.findOne({ email: userData.email });
    if (!user) {
      user = new User({
        username: userData.name,
        email: userData.email,
        password: userData.id,
        role: 'user',
      });
      await user.save();
    }

    const payload = {
      user: {
        id: user.id,
      },
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: 360000 });

    res.status(200).json({ token, user });
    // res.status(200).json({user:userResponse.data, token: id_token,decoded_token});
  } catch (error) {
    console.error('Error during callback:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
