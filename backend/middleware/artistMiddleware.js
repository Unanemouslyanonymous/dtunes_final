/*todo
jwt token is the bearer header

check if user is artist

if not return error

 */

import jwt from 'jsonwebtoken'
import User from '../models/User.js'

const artistAuth = async(req,res,next)=>{
    
    const authHeader = req.header('Authorization')

    if(!authHeader){
        return res.status(401).json({ message: 'No token, authorization denied' })
    }
    const token = authHeader.replace('Bearer ','')

    try{
        const decoded = jwt.verify(token,process.env.JWT_SECRET)
        const user = await User.findById(decoded.user.id).select('-password')

        if(user.role !== 'artist'){
            return res.status(401).json({ message: 'Artist Access Required' })
        }
        req.user = user
        next();   
    }   catch(err){
        res.status(401).json({ message: 'Token is not valid' })
    }
};

export default artistAuth