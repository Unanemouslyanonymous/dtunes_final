import express from 'express';
import { register, login, loadUser } from '../controllers/authController.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/', loadUser);

export default router;
