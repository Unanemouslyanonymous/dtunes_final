import express from 'express';
import { createPartyModePlaylist } from '../controllers/partyModeContoller.js';

const router = express.Router();

router.post('/create', createPartyModePlaylist);

export default router;
