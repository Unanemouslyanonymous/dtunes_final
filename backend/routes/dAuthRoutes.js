import express from 'express';
import { handleLogin, handleCallback } from '../controllers/dAuthController.js';

const router = express.Router();

router.get('/login', handleLogin);
router.get('/callback', handleCallback);

export default router;
